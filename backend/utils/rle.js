/**
 * Run Length Encoding (RLE) implementation for strings.
 * Menggunakan format: {karakter}{jumlah}~
 * Contoh: "AAAB" -> "A3~B1~"
 * Format ini aman untuk karakter angka di dalam teks asal.
 */

function encode(input) {
    if (!input) return "";
    let output = "";
    let count = 1;
    for (let i = 0; i < input.length; i++) {
        if (input[i] === input[i + 1]) {
            count++;
        } else {
            output += input[i] + count + "~";
            count = 1;
        }
    }
    return output;
}

function decode(input) {
    if (!input) return "";
    let output = "";
    let chunks = input.split("~");
    chunks.pop(); // Menghapus elemen kosong terakhir karena split oleh '~' di akhir string
    for (let chunk of chunks) {
        if (chunk.length < 2) continue;
        let char = chunk[0];
        let count = parseInt(chunk.substring(1), 10);
        if (!isNaN(count)) {
            output += char.repeat(count);
        }
    }
    return output;
}

module.exports = {
    encode,
    decode
};
