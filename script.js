function increment(id) {
  const input = document.getElementById(id);
  input.value = Math.max(0, parseInt(input.value) + 1);
}

function decrement(id) {
  const input = document.getElementById(id);
  input.value = Math.max(0, parseInt(input.value) - 1);
}

let droppedCount = 0;
let isKPKCorrect = false;
let isFPBCorrect = false;

function start() {
  const number1 = document.getElementById('number1').value;
  const number2 = document.getElementById('number2').value;

  if (number1 === '' || number2 === '' || number1 == 0 || number2 == 0) {
    Swal.fire({
      title: 'Jangan Lupa !!',
      text: 'Masukkin angkanya dulu',
      icon: 'error',
      showConfirmButton: false,
      timer: 1000
    });
  } else {
    Swal.fire({
      title: 'Angka Tersimpan!',
      text: `Nilai Pertama: ${number1} dan Nilai kedua: ${number2}`,
      icon: 'info',
      showConfirmButton: false,
      timer: 1000
    });
    document.getElementById('action-buttons').classList.remove('hidden');
    document.getElementById('input-section').classList.add('hidden');
    document.getElementById('btn-back').classList.add('hidden');
    
    // Show instruction text
    document.getElementById('instruction-text').classList.remove('hidden');
  }
}

function calculateKPK() {
  const number1 = parseInt(document.getElementById('number1').value);
  const number2 = parseInt(document.getElementById('number2').value);

  const kpkValue = lcm(number1, number2);
  populateGrid(kpkValue);

  isKPKCorrect = true;
  isFPBCorrect = false;

  displayCirclesAndGrid();
  generateDraggableObjects(number1, number2);
  
  document.getElementById('fpb-btn').classList.add('hidden');
  document.getElementById('instruction-text').classList.add('hidden');
  checkBothCalculations();
  document.getElementById('reset-btn').classList.remove('hidden');
  document.getElementById('pilih-text').classList.remove('hidden');
  document.getElementById('button-grid').classList.remove('hidden');
}

function calculateFPB() {
  const number1 = parseInt(document.getElementById('number1').value);
  const number2 = parseInt(document.getElementById('number2').value);

  const fpbValue = gcd(number1, number2);
  populateGrid(fpbValue);

  isFPBCorrect = true;
  isKPKCorrect = false;

  displayCirclesAndGrid();
  generateDraggableObjects(number1, number2);

  document.getElementById('kpk-btn').classList.add('hidden');
  document.getElementById('instruction-text').classList.add('hidden');
  checkBothCalculations();
  document.getElementById('reset-btn').classList.remove('hidden');
  document.getElementById('pilih-text').classList.remove('hidden');
  document.getElementById('button-grid').classList.remove('hidden');
}

// Fungsi untuk menghitung KPK
function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

// Fungsi untuk menghitung FPB
function gcd(a, b) {
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

// Fungsi untuk menampilkan grid
function populateGrid() {
  const grid = document.getElementById('button-grid');
  grid.innerHTML = ''; // Kosongkan grid sebelumnya

  for (let i = 1; i <= 50; i++) {
    const button = document.createElement('button');
    button.className = 'text bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-full relative';
    button.textContent = i; // Tampilkan angka grid
    button.setAttribute('data-grid-value', i); // Simpan nilai asli grid
    button.ondrop = drop;
    button.ondragover = allowDrop;

    // Tambahkan event klik untuk validasi jawaban
    button.onclick = () => validateAnswer(button);

    grid.appendChild(button);
  }
}

let droppedIDs = [];

function generateDraggableObjects(number1, number2) {
  const draggableContainer = document.getElementById('draggableObjects');

  draggableContainer.classList.remove('hidden');

  // Membuat objek draggable dari input 1 (jika belum ada)
  if (!document.getElementById('draggable1')) {
    const object1 = document.createElement('div');
    object1.id = 'draggable1';
    object1.className = 'draggable text w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white';
    object1.draggable = true;
    object1.ondragstart = drag;
    object1.textContent = `${number1}`; // Menggunakan teks input1
    draggableContainer.appendChild(object1);
  }

  // Membuat objek draggable dari input 2 (jika belum ada)
  if (!document.getElementById('draggable2')) {
    const object2 = document.createElement('div');
    object2.id = 'draggable2';
    object2.className = 'draggable text w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white';
    object2.draggable = true;
    object2.ondragstart = drag;
    object2.textContent = `${number2}`; // Menggunakan teks input2
    draggableContainer.appendChild(object2);
  }
}

function displayCirclesAndGrid() {
  const number1 = document.getElementById('number1').value;
  const number2 = document.getElementById('number2').value;
  document.getElementById('output-section').classList.remove('hidden');
}

// Fungsi drag untuk mendrag objek
function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();

  const data = event.dataTransfer.getData("text");
  const droppedObject = document.getElementById(data);
  const targetButton = event.target;

  // Ambil nilai dari grid (atribut data-grid-value)
  const gridValue = parseInt(targetButton.getAttribute('data-grid-value'));

  // Ambil nilai dari objek draggable
  const draggableValue = parseInt(droppedObject.textContent);

  // Cek apakah objek ini sudah ter-drop sebelumnya di grid yang sama
  if (droppedIDs.includes(data + gridValue)) {
    Swal.fire({
      title: 'Opsss!!',
      text: 'Objek ini sudah pernah ter-drop pada grid ini!',
      icon: 'warning',
      showConfirmButton: false,
      timer: 1000
    });
    return; // Batalkan drop jika objek sudah ada di grid yang sama
  }

  // Validasi objek draggable terhadap nilai grid: kelipatan atau faktor
  if (isKPKCorrect) {
    if (gridValue % draggableValue !== 0) {
      Swal.fire({
        title: 'Opsss!!',
        text: `Angka ${gridValue} bukan kelipatan dari ${draggableValue}!`,
        icon: 'error',
        showConfirmButton: false,
        timer: 1000
      });
      return; // Jika bukan kelipatan, batalkan drop
    }
  } else if (isFPBCorrect) {
    if (draggableValue % gridValue !== 0) {
      Swal.fire({
        title: 'Opsss!!',
        text: `Angka ${draggableValue} bukan faktor dari ${gridValue}!`,
        icon: 'error',
        showConfirmButton: false,
        timer: 1000
      });
      return; // Jika bukan faktor, batalkan drop
    }
  }

  // Ambil elemen draggable yang sudah ada di dalam grid ini
  const existingObjects = targetButton.querySelectorAll('.rounded-full');

  // Jika grid sudah berisi 2 objek draggable, tampilkan peringatan
  if (existingObjects.length >= 2) {
    Swal.fire({
      title: 'Opsss!!',
      text: 'Di sini sudah terisi 2 objek draggable!',
      icon: 'warning',
      showConfirmButton: false,
      timer: 1000
    });
    return;
  }

  // Tambahkan elemen visual untuk objek draggable
  const miniObject = document.createElement('div');
  miniObject.className = `w-4 h-4 rounded-full bg-${droppedObject.classList.contains('bg-red-500') ? 'red' : 'green'}-500 text-white flex items-center justify-center`;
  miniObject.textContent = draggableValue;

  // Posisi acak di dalam tombol
  miniObject.style.position = 'absolute';
  miniObject.style.top = `${Math.random() * 50 + 25}%`;
  miniObject.style.left = `${Math.random() * 50 + 25}%`;

  targetButton.appendChild(miniObject);

  // Tandai objek ini sebagai sudah ter-drop pada grid tertentu
  droppedIDs.push(data + gridValue); // Tandai dengan kombinasi ID objek dan ID grid

  Swal.fire({
    title: 'Berhasil!',
    text: 'Angka berhasil disimpan!',
    icon: 'success',
    showConfirmButton: false,
    timer: 1000
  });
}


// Tambahkan variabel untuk menyimpan hasil KPK dan FPB
let currentAnswer = null;


function validateAnswer(button) {
  // Ambil nilai grid
  const gridValue = parseInt(button.getAttribute('data-grid-value'));

  // Ambil semua elemen kecil dari grid ini
  const miniObjects = button.querySelectorAll('.rounded-full');

  // Pastikan ada 2 elemen yang dijatuhkan
  if (miniObjects.length < 2) {
    Swal.fire({
      title: 'Belum Lengkap!',
      text: 'Jawaban Belum Terisi!!',
      icon: 'error',
      showConfirmButton: false,
      timer: 1000
    });
    return;
  }

  // Ambil nilai dari objek draggable
  const draggableValues = Array.from(miniObjects).map(obj => parseInt(obj.textContent));

  let isValid = false; // Untuk validasi jawaban
  let correctAnswer = null; // Jawaban benar
  const number1 = document.getElementById('number1').value;
  const number2 = document.getElementById('number2').value;

  let metode = ""; // Variabel untuk menyimpan metode yang dipilih

  if (isKPKCorrect) {
    // Hitung KPK dari angka draggable
    correctAnswer = draggableValues.reduce((acc, value) => lcm(acc, value), 1);
    metode = "KPK";
    // Periksa apakah nilai grid adalah KPK
    isValid = gridValue === correctAnswer;

  } else if (isFPBCorrect) {
    // Hitung FPB dari angka draggable
    correctAnswer = draggableValues.reduce((acc, value) => gcd(acc, value), draggableValues[0]);
    metode = "FPB";
    // Periksa apakah nilai grid adalah FPB
    isValid = gridValue === correctAnswer;
  }

  // Konfirmasi Jawaban
  Swal.fire({
    title: 'Konfirmasi',
    text: `Apakah Anda yakin dengan jawaban ini?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Tidak'
  }).then((result) => {
    if (result.isConfirmed) {
      if (isValid) {
        button.classList.add('bg-green-500');
        Swal.fire('Benar!', `Jawaban Anda benar. ${metode} dari ${number1} dan ${number2} adalah ${correctAnswer}.`, 'success');
        document.getElementById('next-btn').classList.remove('hidden'),document.getElementById('draggableObjects').classList.add('hidden');
      } else {
        button.classList.add('bg-red-500');
        Swal.fire('Salah!', `Cek Lagi Jawabannya!!.`, 'error');
      }
    }
  });
}


// Fungsi untuk menghitung KPK
function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

// Fungsi untuk menghitung FPB
function gcd(a, b) {
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}


function resetGrid() {
  // Menampilkan konfirmasi reset
  Swal.fire({
    title: 'Konfirmasi',
    text: "Apakah Anda yakin ingin mereset grid? Semua objek yang di-drop akan dihapus.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Tidak'
  }).then((result) => {
    if (result.isConfirmed) {
      // Menghapus objek dari grid
      const gridButtons = document.querySelectorAll('#button-grid button');
      gridButtons.forEach(button => {
        const droppedObjects = button.querySelectorAll('.rounded-full');
        droppedObjects.forEach(object => {
          button.removeChild(object); // Menghapus objek yang ada
        });
        // Mengembalikan warna tombol grid ke semula
        button.classList.remove('bg-green-500', 'bg-red-500');
        button.classList.add('bg-gray-200', 'hover:bg-gray-300');
      });

      // Mengosongkan array droppedIDs
      droppedIDs = [];

      Swal.fire({
        title: 'Reset!',
        text: 'Grid telah direset, Anda dapat memulai lagi!',
        icon: 'success',
        confirmButtonText: 'OK'
      })
      ;
    }
  });
}

function confirmGrid() {
      // Menghapus objek dari grid
      const gridButtons = document.querySelectorAll('#button-grid button');
      gridButtons.forEach(button => {
        const droppedObjects = button.querySelectorAll('.rounded-full');
        droppedObjects.forEach(object => {
          button.removeChild(object); // Menghapus objek yang ada
        });
        // Mengembalikan warna tombol grid ke semula
        button.classList.remove('bg-green-500', 'bg-red-500');
        button.classList.add('bg-gray-200', 'hover:bg-gray-300');
      });

      // Mengosongkan array droppedIDs
      droppedIDs = [];
    }

function nextstep() {
  // Menampilkan konfirmasi untuk lanjut
  Swal.fire({
    title: 'Lanjut ke Perhitungan Selanjutnya',
    text: '',
    icon: 'info',
    showConfirmButton: false,
    timer: 1000
  }).then(() => {
    // Reset grid
    confirmGrid();

    // Menghapus objek draggable dari layar
    const draggableContainer = document.getElementById('draggableObjects');
    while (draggableContainer.firstChild) {
      draggableContainer.removeChild(draggableContainer.firstChild);
    }
    draggableContainer.classList.add('hidden'); // Menyembunyikan objek draggable

    // Menampilkan kembali instruksi dan tombol untuk KPK/FPB
    document.getElementById('instruction-text').classList.remove('hidden');
    document.getElementById('pilih-text').classList.add('hidden');
    document.getElementById('button-grid').classList.add('hidden');
    document.getElementById('reset-btn').classList.add('hidden');

    // Periksa apakah tombol lanjut perlu direset
    checkBothCalculations();
  });
}


function showNextOptions() {
  document.getElementById('next-btn').classList.add('hidden'); // Sembunyikan tombol Lanjut

  // Tampilkan dan sembunyikan tombol KPK/FPB sesuai logika
  document.getElementById('kpk-btn').classList.toggle('hidden');
  document.getElementById('fpb-btn').classList.toggle('hidden');
  document.getElementById('instruction-text').classList.remove('hidden');
  document.getElementById('pilih-text').classList.add('hidden');
  document.getElementById('button-grid').classList.add('hidden');
  document.getElementById('reset-btn').classList.add('hidden');
  document.getElementById('draggableObjects').classList.remove('hidden');

  nextstep();
}

function checkBothCalculations() {
  // Jika kedua tombol KPK dan FPB sudah ditekan
  if (isKPKCorrect && isFPBCorrect) {
      const nextButton = document.getElementById('next-btn');
      nextButton.textContent = 'Refresh'; // Ubah teks tombol menjadi Refresh
      nextButton.onclick = () => location.reload(); // Tambahkan fungsi refresh halaman
      nextButton.classList.remove('hidden'); // Tampilkan tombol
  }
}

function Menu(e){
  let list = document.querySelector('ul');
  e.name === 'menu' ? (e.name = "close",list.classList.add('top-[80px]') , list.classList.add('opacity-100'), list.classList.add('z-40')) 
  :( e.name = "menu" ,list.classList.remove('top-[80px]'),list.classList.remove('opacity-100'))
  }





