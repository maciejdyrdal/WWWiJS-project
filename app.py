import asyncio
import json
import secrets

import websockets

from game import PLAYER1, PLAYER2, Game


JOIN = {}


async def error(websocket, message):
    event = {
        "type": "error",
        "message": message,
    }
    await websocket.send(json.dumps(event))


async def replay(websocket, game):
    for player, column, row, direction, attack in game.moves.copy():
        event = {
            "type": "play",
            "player": player,
            "column": column,
            "row": row,
            "direction": direction,
            "attack": attack,

        }
        await websocket.send(json.dumps(event))


async def play(websocket, game, player, connected):
    async for message in websocket:
        event = json.loads(message)
        assert event["type"] == "play"
        column = event["column"]
        row = event["row"]
        direction = event["direction"]
        attack = event["attack"]

        try:
            new_column, new_row, new_direction, new_attack = game.play(player, int(column), int(row), direction, attack)
        except RuntimeError as exc:
            await error(websocket, str(exc))
            continue

        event = {
            "type": "play",
            "player": player,
            "column": new_column,
            "row": new_row,
            "direction": new_direction,
            "attack": new_attack,
        }
        websockets.broadcast(connected, json.dumps(event))

        if game.winner is not None:
            event = {
                "type": "win",
                "player": game.winner,
            }
            websockets.broadcast(connected, json.dumps(event))


async def start(websocket):
    game = Game()
    connected = {websocket}

    join_key = secrets.token_urlsafe(12)
    JOIN[join_key] = game, connected

    try:
        event = {
            "type": "init",
            "join": join_key,
        }
        await websocket.send(json.dumps(event))
        await play(websocket, game, PLAYER1, connected)        
    finally:
        del JOIN[join_key]


async def join(websocket, join_key):
    try:
        game, connected = JOIN[join_key]
    except KeyError:
        await error(websocket, "Game not found.")
        return

    connected.add(websocket)
    try:
        await replay(websocket, game)
        await play(websocket, game, PLAYER2, connected)
    finally:
        connected.remove(websocket)


async def handler(websocket):
    message = await websocket.recv()
    event = json.loads(message)
    assert event["type"] == "init"

    if "join" in event:
        await join(websocket, event["join"])
    else:
        await start(websocket)


async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())