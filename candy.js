// Süslü parantez içine önceden tanımlanmış 6 adet renkli şeker
var candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
// Oyun tahtasını temsil eden boş bir 2D dizi
var board = [];
// Tahta boyutları
var rows = 9;
var columns = 9;
// Oyuncu puanı
var score = 0;

// Şu anki ve diğer sürüklenen şeker
var currTile;
var otherTile;

// Sayfa yüklendiğinde oyunu başlat
window.onload = function() {
    startGame();

    // Her 1/10 saniyede bir, şekerleri kır, kaydır ve yeni şekerler üret
    window.setInterval(function(){
        crushCandy();
        slideCandy();
        generateCandy();
    }, 100);
}

// Rastgele bir şeker seçen fonksiyon
function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]; // 0 - 5.99 arası rastgele bir sayı seçer
}

// Oyunu başlatan fonksiyon
function startGame() {
    // Tahta oluşturma döngüsü
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            // Yeni bir şeker oluştur ve tahta üzerine yerleştir
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomCandy() + ".png";

            // Sürükleme işlevleri ekle
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            // Tahtaya eklenen şekerin DOM üzerinde görünmesi
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        // Tahta satırını tahta dizisine ekle
        board.push(row);
    }

    console.log(board); // Oluşturulan tahta dizisini konsola yazdır
}

// Sürükleme işlemi başladığında çağrılan fonksiyon
function dragStart() {
    currTile = this; // Şu anki sürüklenen döşemeyi belirle
}

// Sürüklenen şeker üzerine geldiğinde çağrılan fonksiyon
function dragOver(e) {
    e.preventDefault(); // Varsayılan sürükleme davranışını engelle
}

// Sürüklenen şekerin üzerine geldiğinde çağrılan fonksiyon
function dragEnter(e) {
    e.preventDefault(); // Varsayılan sürükleme davranışını engelle
}

// Sürüklenen şekerin üzerinden ayrıldığında çağrılan fonksiyon
function dragLeave() {
    // Herhangi bir işlem yapma
}

// Sürüklenen şeker bırakıldığında çağrılan fonksiyon
function dragDrop() {
    otherTile = this; // Bırakılan hedef döşemeyi belirle
}

// Sürükleme işlemi sona erdiğinde çağrılan fonksiyon
function dragEnd() {
    // Eğer sürüklenen veya bırakılan şekerin resmi "boş" içeriyorsa işlem yapma
    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    // Şekerlerin koordinatlarını al
    let currCoords = currTile.id.split("-"); // id="0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    // Şekerlerin yan yana olup olmadığını kontrol et
    let moveLeft = c2 == c-1 && r == r2;
    let moveRight = c2 == c+1 && r == r2;
    let moveUp = r2 == r-1 && c == c2;
    let moveDown = r2 == r+1 && c == c2;
    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    // Eğer şekerler yan yana ise
    if (isAdjacent) {
        // Şekerleri yer değiştir
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

        // Yapılan hamle geçerli mi diye kontrol et
        let validMove = checkValid();
        if (!validMove) {
            // Geçersiz hamle ise şekerleri geri yerlerine koy
            currTile.src = currImg;
            otherTile.src = otherImg;    
        }
    }
}

// Şekerleri kırma işlevi
function crushCandy() {
    // Üçlü şekerleri kır
    crushThree();
    // Oyuncu puanını güncelle
    document.getElementById("score").innerText = score;
}

// Üçlü şekerleri kırma işlevi
function crushThree() {
    // Satırları kontrol et
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            // Eğer üç şeker aynı türde ise ve boş değilse
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                // Şekerleri "boş" resimle değiştir ve puanı artır
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30;
            }
            }
        }
    }

    // Sütun
// Tahtada geçerli bir hareket olup olmadığını kontrol eden fonksiyon
function checkValid() {
    // Satırları kontrol et
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            // Üç ardışık şeker aynı türde ve boş değilse
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true; // Geçerli bir hareket bulunduğunda true döndür
            }
        }
    }

    // Sütunları kontrol et
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            // Üç ardışık şeker aynı türde ve boş değilse
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true; // Geçerli bir hareket bulunduğunda true döndür
            }
        }
    }

    return false; // Herhangi bir geçerli hareket bulunamazsa false döndür
}

// Şekerleri kaydıran fonksiyon
function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = columns-1; r >= 0; r--) {
            // Boş olmayan şekerleri aşağıdan yukarıya doğru kaydır
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }

        // Tahtanın en üstünde boş olan yeri doldur
        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}

// Boş olan yere yeni şekerler oluşturan fonksiyon
function generateCandy() {
    for (let c = 0; c < columns;  c++) {
        // Eğer tahtanın en üstündeki hücre boş ise
        if (board[0][c].src.includes("blank")) {
            // Yeni bir rastgele şeker oluştur ve boş hücreye yerleştir
            board[0][c].src = "./images/" + randomCandy() + ".png";
        }
    }
}
