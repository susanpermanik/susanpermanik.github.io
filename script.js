document.addEventListener("DOMContentLoaded", () => {
    const namaBarang = document.getElementById("namaBarang");
    const jumlahBarang = document.getElementById("jumlahBarang");
    const tambahBtn = document.getElementById("tambahBtn");
    const tabelBarang = document.getElementById("tabelBarang");
    const totalBarang = document.getElementById("totalBarang");
    const searchInput = document.getElementById("searchInput");

    let dataBarang = JSON.parse(localStorage.getItem("dataBarang")) || [];

    function simpanData() {
        localStorage.setItem("dataBarang", JSON.stringify(dataBarang));
    }

    function renderTabel(filter = "") {
        tabelBarang.innerHTML = "";
        let total = 0;
        dataBarang
            .filter(item => item.nama.toLowerCase().includes(filter.toLowerCase()))
            .forEach((item, index) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.nama}</td>
                    <td>${item.jumlah}</td>
                    <td>${item.tanggalIn || '-'}</td>
                    <td>${item.tanggalOut || '-'}</td>
                    <td>
                        <button class="action-btn" onclick="editBarang(${index})">Edit</button>
                        <button class="delete-btn" onclick="hapusBarang(${index})">Hapus</button>
                    </td>
                `;
                tabelBarang.appendChild(tr);
                total += parseInt(item.jumlah);
            });
        totalBarang.textContent = total;
    }

    window.editBarang = (index) => {
        const item = dataBarang[index];
        const newJumlah = prompt("Masukkan jumlah baru untuk " + item.nama, item.jumlah);
        const newTanggalOut = new Date().toLocaleString("id-ID");

        if (newJumlah !== null && newJumlah !== "") {
            dataBarang[index].jumlah = parseInt(newJumlah);
            dataBarang[index].tanggalOut = newTanggalOut;
            simpanData();
            renderTabel(searchInput.value);
        }
    };

    window.hapusBarang = (index) => {
        if (confirm("Yakin ingin menghapus barang ini?")) {
            dataBarang.splice(index, 1);
            simpanData();
            renderTabel(searchInput.value);
        }
    };

    tambahBtn.addEventListener("click", () => {
        if (namaBarang.value.trim() && jumlahBarang.value.trim()) {
            const tanggalIn = new Date().toLocaleString("id-ID");
            dataBarang.push({
                nama: namaBarang.value.trim(),
                jumlah: parseInt(jumlahBarang.value.trim()),
                tanggalIn: tanggalIn,
                tanggalOut: "-"
            });
            simpanData();
            renderTabel();
            namaBarang.value = "";
            jumlahBarang.value = "";
        } else {
            alert("Isi nama dan jumlah barang terlebih dahulu!");
        }
    });

    searchInput.addEventListener("input", (e) => {
        renderTabel(e.target.value);
    });

    renderTabel();
});
