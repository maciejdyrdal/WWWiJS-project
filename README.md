# WWWiJS-project: simple, turn-based multiplayer browser game

## Running the game:
1. Clone the repository
2. Create a Python virtual environment and activate it: ```python -m venv .venv```, then ```.venv\Scripts\Activate.ps1``` in Powershell or ```source myvenv/bin/activate``` on Linux/MacOS
3. Download the required dependencies: ```pip install -r requirements.txt```
4. Run ```python -m http.server```
5. In a seperate shell instance, run ```python app.py```
6. go to http://localhost:8000/
7. Open the link under the "JOIN" button in another tab/window/device to join as the second player

## Gameplay:

A player can either move or attack, and change the direction the character is facing. <br>
To move: click on a valid tile, choose a direction you want to be facing afterwards, then click "Don't attack" and "Move". <br>
To attack: Click on your character, then choose a direction you want to be facing afterwards (shouldn't matter), then click "Attack" and "Move". <br>
The game will alert you if you try to perform an illegal move or once one of the players has won.

## Screenshots:

Start of the game: <br>
![Screenshot 2023-09-12 224626](https://github.com/maciejdyrdal/WWWiJS-project/assets/64736385/86413ea0-1dbd-48c6-a696-ec7655a42585)
<br> <br> Second player's view: <br>
![Screenshot 2023-09-12 224658](https://github.com/maciejdyrdal/WWWiJS-project/assets/64736385/75bda75a-647b-4273-9423-c71ad2376fcd)
<br> <br> Alert informing about an illegal move: <br>
![Screenshot 2023-09-12 224728](https://github.com/maciejdyrdal/WWWiJS-project/assets/64736385/e1cb491b-bebf-4de8-81f3-23ae73c0698e)
<br> <br> End of the game: <br>
![Screenshot 2023-09-12 224801](https://github.com/maciejdyrdal/WWWiJS-project/assets/64736385/f343fde4-9bb1-4be0-a4df-f1e083d67741)
