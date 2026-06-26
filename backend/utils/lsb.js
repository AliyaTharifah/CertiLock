const Jimp = require('jimp');

// Helper: Konversi teks ke representasi biner (8-bit per karakter)
function stringToBinary(str) {
    let binary = "";
    for (let i = 0; i < str.length; i++) {
        let bin = str.charCodeAt(i).toString(2);
        binary += "0".repeat(8 - bin.length) + bin;
    }
    return binary;
}

// Helper: Konversi string biner ke teks
function binaryToString(binary) {
    let text = "";
    for (let i = 0; i < binary.length; i += 8) {
        let byte = binary.substr(i, 8);
        if (byte.length === 8) {
            text += String.fromCharCode(parseInt(byte, 2));
        }
    }
    return text;
}

/**
 * Menyisipkan data rahasia ke dalam gambar menggunakan LSB
 * @param {string} imagePath - Path gambar sumber
 * @param {string} secretData - Data (string) yang akan disisipkan
 * @param {string} outputPath - Path untuk menyimpan stego-image (harus .png)
 * @returns {Promise<string>}
 */
async function encodeLSB(imagePath, secretData, outputPath) {
    try {
        const image = await Jimp.read(imagePath);
        // Tambahkan delimiter agar decoder tahu kapan harus berhenti
        const payload = secretData + "###END###";
        const binaryData = stringToBinary(payload);
        
        let dataIndex = 0;
        const data = image.bitmap.data;
        
        // Kapasitas: (width * height * 3) bit (kita hanya gunakan R, G, B)
        const maxCapacity = (image.bitmap.width * image.bitmap.height * 3);
        if (binaryData.length > maxCapacity) {
            throw new Error("Ukuran data terlalu besar untuk gambar ini.");
        }
        
        for (let i = 0; i < data.length; i++) {
            // Channel (R, G, B, A). Lewati Alpha channel (index 3, 7, 11, dst)
            if ((i + 1) % 4 === 0) continue;
            
            if (dataIndex < binaryData.length) {
                let bit = parseInt(binaryData[dataIndex], 10);
                // Clear bit paling belakang, kemudian set dengan bit rahasia
                data[i] = (data[i] & ~1) | bit;
                dataIndex++;
            } else {
                break; // Data sudah tersisip semua
            }
        }
        
        await image.writeAsync(outputPath);
        return outputPath;
    } catch (error) {
        console.error("Error in encodeLSB:", error);
        throw error;
    }
}

/**
 * Mengekstrak data rahasia dari gambar yang disisipkan dengan LSB
 * @param {string} imagePath - Path stego-image
 * @returns {Promise<string|null>} Data rahasia yang diekstrak, atau null jika tidak valid
 */
async function decodeLSB(imagePath) {
    try {
        const image = await Jimp.read(imagePath);
        const data = image.bitmap.data;
        
        let binaryData = "";
        
        // Ekstrak semua LSB
        for (let i = 0; i < data.length; i++) {
            if ((i + 1) % 4 === 0) continue;
            binaryData += (data[i] & 1).toString();
        }
        
        // Konversi biner ke teks
        const text = binaryToString(binaryData);
        
        // Cari delimiter untuk memotong padding sampah (garbage data) dari sisa piksel
        const endMarker = "###END###";
        const endIndex = text.indexOf(endMarker);
        
        if (endIndex !== -1) {
            return text.substring(0, endIndex);
        }
        return null;
    } catch (error) {
        console.error("Error in decodeLSB:", error);
        throw error;
    }
}

module.exports = {
    encodeLSB,
    decodeLSB
};
