# 2048 Game

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg) ![Languages](https://img.shields.io/badge/languages-HTML%2C%20CSS%2C%20JS-orange.svg) ![Status](https://img.shields.io/badge/status-complete-brightgreen.svg)

A simple, clean, and responsive implementation of the classic 2048 puzzle game, built with HTML, CSS, and vanilla JavaScript.



## Table of Contents

- [How to Play](#how-to-play)
- [Features](#features)
- [Getting Started](#getting-started)
- [File Structure](#file-structure)
- [Contributing](#contributing)
- [License](#license)

## How to Play

The objective of the game is to slide numbered tiles on a grid to combine them and create a tile with the number 2048.

-   **Use your arrow keys** (`Up`, `Down`, `Left`, `Right`) to move the tiles.
-   On touch devices, you can **swipe** in the desired direction.
-   When two tiles with the same number touch, they **merge into one!**
-   A new tile (either a 2 or a 4) will appear in a random empty spot after each move.
-   The game ends when the board is full and no more moves can be made.

## Features

-   **Classic 2048 Gameplay**: The familiar and addictive puzzle mechanics.
-   **Score Tracking**: Your score increases as you merge tiles.
-   **Responsive Design**: The game board and UI adapt to fit any screen size, from mobile phones to desktops.
-   **Touch Controls**: Fully playable on touch-screen devices with swipe gestures.
-   **Smooth Animations**: Tiles slide and merge with fluid animations.
-   **Game Over Screen**: A clear "Game Over" message appears when you can no longer make a move.
-   **New Game Button**: Easily restart the game at any point.

## Getting Started

To run this project locally, simply follow these steps:

1.  **Clone the repository** or download the files.
    ```bash
    git clone [https://github.com/your-username/twenty-forty-eight.git](https://github.com/your-username/twenty-forty-eight.git)
    ```
2.  **Navigate to the project directory.**
    ```bash
    cd twenty-forty-eight
    ```
3.  **Open the `index.html` file** in your favorite web browser.

That's it! You can now play the game.

## File Structure

The project is organized into three main files:

-   `index.html`: The main HTML file that provides the structure for the game board and UI elements.
-   `style.css`: Contains all the styles for the game, including the layout, tile colors, and animations.
-   `script.js`: The core game logic, handling user input, tile movement, merging, score calculation, and game state management.

## Contributing

Contributions are welcome! If you have ideas for improvements or find any bugs, feel free to open an issue or submit a pull request.
