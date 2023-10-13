const winsDiagonale1 = [
    // Winner pour le diagonale
    // ====== Diagonale 1  il faut ajouter + 6 ====== //
    [21, 15, 9, 3],
    [28, 22, 16, 10],
    [22, 16, 10, 4],
    [35, 29, 23, 17],
    [29, 23, 17, 11],
    [23, 17, 11, 5],
    [36, 30, 24, 18],
    [30, 24, 18, 12],
    [24, 18, 12, 6],
    [37, 31, 25, 19],
    [31, 25, 19, 13],
    [38, 32, 26, 20],
]

const winsDiagonale2 = [

    // ====== Diagonale 2  il faut ajouter + 8 ====== //
    [3, 11, 19, 27],
    [2, 10, 18, 26],
    [10, 18, 26, 34],
    [1, 9, 17, 25],
    [9, 17, 25, 33],
    [17, 25, 33, 41],
    [0, 8, 16, 24],
    [8, 16, 24, 32],
    [16, 24, 32, 40],
    [7, 15, 23, 31],
    [15, 23, 31, 39],
    [14, 22, 30, 38],
    
]

const winsHorizontale = [
    // Winner pour l'horizontale  //
    // ====== ligne 1 ====== //
    [0, 1, 2, 3],
    [1, 2, 3, 4],
    [2, 3, 4, 5],
    [3, 4, 5, 6],

    // ====== ligne 2 ====== //

    [7, 8, 9, 10],
    [8, 9, 10, 11],
    [9, 10, 11, 12],
    [10, 11, 12, 13],

    
    // ====== ligne 3 ====== //

    [14, 15, 16, 17],
    [15, 16, 17, 18],
    [16, 17, 18, 19],
    [17, 18, 19, 20],

    // ====== ligne 4 ====== //

    [21, 22, 23, 24],
    [22, 23, 24, 25],
    [23, 24, 25, 26],
    [24, 25, 26, 27],

    // ====== ligne 5 ====== //

    [28, 29, 30, 31],
    [29, 30, 31, 32],
    [30, 31, 32, 33],
    [31, 32, 33, 34],

    // ====== ligne 6 ====== //

    [35, 36, 37, 38],
    [36, 37, 38, 39],
    [37, 38, 39, 40],
    [38, 39, 40, 41],
]
const winsVerticale = [

    // Winner pour le verticale
    // ====== Colonne 1 ====== //
    [0, 7, 14, 21],
    [7, 14, 21, 28],
    [14, 21, 28, 35],

    // ====== Colonne 2 ====== //

    [1, 8, 15, 22],
    [8, 15, 22, 29],
    [15, 22, 29, 36],
    
    // ====== Colonne 3 ====== //

    [2, 9, 16, 23],
    [9, 16, 23, 30],
    [16, 23, 30, 37],

    // ====== Colonne 4 ====== //

    [3, 10, 17, 24],
    [10, 17, 24, 31],
    [17, 24, 31, 38],

    // ====== Colonne 5 ====== //

    [4, 11, 18, 25],
    [11, 18, 25, 32],
    [18, 25, 32, 39],

    // ====== Colonne 6 ====== //

    [5, 12, 19, 26],
    [12, 19, 26, 33],
    [19, 26, 33, 40],

    // ====== Colonne 6 ====== //

    [6, 13, 20, 27],
    [13, 20, 27, 34],
    [20, 27, 34, 41],
]
const sameCol = [
    [0, 7, 14, 21, 28, 35],
    [1, 8, 15, 22, 29, 36],
    [2, 9, 16, 23, 30, 37],
    [3, 10, 17, 24, 31, 38],
    [4, 11, 18, 25, 32, 39],
    [5, 12, 19, 26, 33, 40],
    [6, 13, 20, 27, 34, 41],
]
const player1 = "o"
const player2 = "x"
let turn = true
let grid = []
let gridCheck = []
let realGrid = []
let IA = []

displayWinner = (winner) => {
    if ( winner === "b") return
    const game = document.querySelector(".game")
    const table = document.querySelector(".game table")
    const result = document.querySelector('.result h1')
    game.removeChild(table)
    if(winner === "o") {
        result.innerText = `L' IA' 💧 à gagner `
        setTimeout(() => {
            createGrid(6, 7)
        }, 5000);
        return
    }
    if(winner === "x") {
        result.innerText = `Le joueur 🔥 à gagner `
        setTimeout(() => {
            createGrid(6, 7)
        }, 5000);
        return
    }
}

compareTable = (tab1, tab2) => {
    let result = false
    for (let i = 0; i < tab1.length; i++) {
        if(tab1[i] === tab2[i]) result = true
        else {
            result = false 
            return false        
        }
    }
    return result
}

checkWin = (currentGrid ) => {
    for (let i = 0; i < gridCheck.length; i++) {
        if(gridCheck[i] === true) {
            if((gridCheck[i + 1] === true) && (grid[i] == grid[i + 1])) {
                if((gridCheck[i + 2] === true) && (grid[i] == grid[i + 2])) {
                    if((gridCheck[i + 3] === true) && (grid[i] == grid[i + 1])) {
                        test = [i, i + 1, i + 2, i + 3]
                        for (let j = 0; j < winsHorizontale.length; j++) {
                            if(compareTable(test, winsHorizontale[j])) {
                                displayWinner(grid[i])
                                return
                            }
                        }
                    }   
                }   
            }
            if((gridCheck[i + 7] === true) && (grid[i] == grid[i + 7])) {
                if((gridCheck[i + 14] === true) && (grid[i] == grid[i + 14])) {
                    if((gridCheck[i + 21] === true)  && (grid[i] == grid[i + 21])){
                        test = [i, i + 7, i + 14, i + 21]
                        for (let j = 0; j < winsVerticale.length; j++) {
                            if(compareTable(test, winsVerticale[j])) {
                                displayWinner(currentGrid[i])
                                return
                            }
                        }
                    }   
                }   
            }
            if((gridCheck[i - 6] === true)  && (grid[i] == grid[i - 6])){
                if((gridCheck[i - 12] === true)  && (grid[i] == grid[i - 12])){
                    if((gridCheck[i - 18] === true)  && (grid[i] == grid[i - 18])){
                        test = [i, i - 6, i - 12, i - 18]
                        for (let j = 0; j < winsDiagonale1.length; j++) {
                            if(compareTable(test, winsDiagonale1[j])) {
                                displayWinner(currentGrid[i])
                                return
                            }
                        }
                    }   
                }   
            }
            if((gridCheck[i + 8] === true)  && (grid[i] == grid[i + 8])){
                if((gridCheck[i + 16] === true)  && (grid[i] == grid[i + 16])){
                    if((gridCheck[i + 24] === true)  && (grid[i] == grid[i + 24])){
                        test = [i, i + 8, i + 16, i + 24]
                        for (let j = 0; j < winsDiagonale2.length; j++) {
                            if(compareTable(test, winsDiagonale2[j])) {
                                displayWinner(currentGrid[i])
                                return
                            }
                        }
                    }   
                }   
            }
        }
    }
}
game = (index) => {
    let block = ""
    if(turn) {
        let block = "<div class = 'block player1'>🔥"
        realGrid[index].innerHTML = block
        grid[index] = "x"
    }
    else {
        let block = "<div class = 'block player2'>💧"
        realGrid[index].innerHTML = block
        grid[index] = "o"
    }
    turn = !turn
    realGrid[index].setAttribute("aria-disabled",true)
}
startGame = (index) => {
    let currentIndex = 0
    for (let i = 0; i < sameCol.length; i++) {
        for (let j = 0; j < sameCol[i].length; j++) {
            if(index == sameCol[i][j]) {
                currentIndex = i
                for (let i = sameCol[currentIndex].length; i >= 0; i--) {
                    if(gridCheck[sameCol[currentIndex][i]] == false) {
                        gridCheck[sameCol[currentIndex][i]] = true
                        return sameCol[currentIndex][i]
                    }
                    else continue
                }
            }
        }
    }
}
createGrid = (line, col) => {
    for (let i = 0; i < line * col; i++) {
        grid[i] = "b"
        gridCheck[i] = false
    }
    const gameDiv = document.querySelector(".game")
    const table = document.createElement("table")
    const result = document.querySelector(".result h1")
    result.innerText = "Connect 4 Game"
    gameDiv.appendChild(table)
    let k = 0;
    for (let i = 0; i < line; i++) {
        const tr =  document.createElement('tr')
        for (let j = 0; j < col; j++) {
            const td =  document.createElement('td')     
            td.setAttribute("id", k++)  
            tr.appendChild(td)
        }
        table.appendChild(tr)
    }

    for (let i = 0; i < grid.length; i++) {
        const div = document.getElementById(i)
        realGrid[i] = div
    }
    realGrid.forEach((element, index) => {
        element.addEventListener("click", () => {
            game(startGame(index)) 

            const ia = Math.floor(Math.random() * 6)
            console.log(ia)
            setTimeout(() => {
                for (let i = sameCol[ia].length; i >= 0; i--) {
                    if(gridCheck[sameCol[ia][i]] == false) {
                        gridCheck[sameCol[ia][i]] = true
                        game(sameCol[ia][i])
                        i = -1
                    }
                    else continue
                }
                checkWin(grid)
            }, 500);

            checkWin(grid)
        }) 
    });

} 


main = () => {
    createGrid(6, 7)
}

main ()