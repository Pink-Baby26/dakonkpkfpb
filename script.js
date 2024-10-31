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
      title: 'Error!',
      text: 'Masukkan angka terlebih dahulu',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  } else {
    Swal.fire({
      title: 'Input Values',
      text: `Nilai pertama: ${number1}, Nilai kedua: ${number2}`,
      icon: 'info',
      confirmButtonText: 'OK'
    });
    document.getElementById('action-buttons').classList.remove('hidden');
    document.getElementById('input-section').classList.add('hidden');
    
    // Show instruction text
    document.getElementById('instruction-text').classList.remove('hidden');
  }
}

function calculateKPK() {
  const number1 = parseInt(document.getElementById('number1').value);
  const number2 = parseInt(document.getElementById('number2').value);
  const kpkValue = lcm(number1, number2);
  populateGrid(kpkValue);
  document.getElementById('fpb-btn').classList.add('hidden');
  displayCirclesAndGrid();
  generateDraggableObjects(number1, number2);
  
  // Hide instruction text
  document.getElementById('instruction-text').classList.add('hidden');
  isKPKCorrect = true;
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
  document.getElementById('kpk-btn').classList.add('hidden');
  displayCirclesAndGrid();
  generateDraggableObjects(number1, number2);
  
  // Hide instruction text
  document.getElementById('instruction-text').classList.add('hidden');
  isFPBCorrect = true;
  checkBothCalculations();
  document.getElementById('reset-btn').classList.remove('hidden');
  document.getElementById('pilih-text').classList.remove('hidden');
  document.getElementById('button-grid').classList.remove('hidden');
}



function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function gcd(a, b) {
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function populateGrid(value) {
  const grid = document.getElementById('button-grid');
  grid.innerHTML = '';

  for (let i = 1; i <= 36; i++) {
    const button = document.createElement('button');
    button.className = 'bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-full relative';
    button.ondrop = drop;
    button.ondragover = allowDrop;

    if (i === value) {
      button.textContent = value;
    } else {
      button.textContent = i;
    }
    grid.appendChild(button);
  }
}


// Fungsi untuk membuat objek draggable dari input number
function generateDraggableObjects(number1, number2) {
  const draggableContainer = document.getElementById('draggableObjects');
  draggableContainer.innerHTML = ''; // Kosongkan objek sebelumnya
  draggableContainer.classList.remove('hidden'); // Tampilkan container

  // Membuat objek draggable dari input 1
  const object1 = document.createElement('div');
  object1.id = 'draggable1';
  object1.draggable = true;
  object1.ondragstart = drag;
  object1.className = 'w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white';
  object1.textContent = `${number1}`; // Menggunakan teks input1
  draggableContainer.appendChild(object1);

  // Membuat objek draggable dari input 2
  const object2 = document.createElement('div');
  object2.id = 'draggable2';
  object2.draggable = true;
  object2.ondragstart = drag;
  object2.className = 'w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white';
  object2.textContent = `${number2}`; // Menggunakan teks input2
  draggableContainer.appendChild(object2);
}

function displayCirclesAndGrid() {
  const number1 = document.getElementById('number1').value;
  const number2 = document.getElementById('number2').value;
  document.getElementById('output-section').classList.remove('hidden');
}

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

  // Periksa apakah objek yang dijatuhkan sudah ada di tombol target
  if (targetButton.querySelector(`#${data}-mini`)) {
    alert("Objek ini sudah di-drop di sini.");
    return; // Mencegah penempatan duplikat
  }

  // Buat miniObject untuk merepresentasikan objek yang dijatuhkan
  const miniObject = document.createElement("div");
  miniObject.className = `w-4 h-4 rounded-full bg-${droppedObject.classList.contains('bg-red-500') ? 'red' : 'green'}-500 text-white flex items-center justify-center`;
  miniObject.textContent = droppedObject.textContent;
  miniObject.id = `${data}-mini`; // ID unik untuk pelacakan

  // Penempatan acak di dalam tombol
  miniObject.style.position = 'absolute';
  miniObject.style.top = `${Math.random() * 50 + 25}%`;
  miniObject.style.left = `${Math.random() * 50 + 25}%`;

  targetButton.appendChild(miniObject);
  
  // Tingkatkan penghitung objek yang dijatuhkan
  droppedCount++;
}

// Tambahkan variabel untuk menyimpan hasil KPK dan FPB
let currentAnswer = null;

// Modifikasi fungsi populateGrid untuk menambahkan event listener
function populateGrid(value) {
  const grid = document.getElementById('button-grid');
  grid.innerHTML = '';
  currentAnswer = value; // Simpan jawaban saat ini untuk pengecekan

  for (let i = 1; i <= 36; i++) {
    const button = document.createElement('button');
    button.className = 'bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded relative';
    button.ondrop = drop;
    button.ondragover = allowDrop;
    button.onclick = () => validateAnswer(i, button); // Tambahkan event listener onclick

    button.textContent = i;
    grid.appendChild(button);
  }
}

// Fungsi untuk memvalidasi jawaban dan mengubah warna tombol
function validateAnswer(selectedValue, button) {
  // Periksa apakah kedua objek draggable telah dijatuhkan
  if (droppedCount < 2) {
    Swal.fire({
      title: 'Error!',
      text: 'Isi Number dengan Jawaban Anda',
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return; // Keluar dari fungsi lebih awal
  }

  const isCorrect = selectedValue === currentAnswer;

  Swal.fire({
    title: 'Konfirmasi',
    text: "Apakah Jawaban Sudah Yakin Benar?",
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Tidak'
  }).then((result) => {
    if (result.isConfirmed) {
      if (isCorrect) {
        button.classList.remove('bg-gray-200', 'hover:bg-gray-300');
        button.classList.add('bg-green-500');
        Swal.fire({
          title: 'Benar!',
          text: 'Jawaban Benar!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          document.getElementById('next-btn').classList.remove('hidden'); // Tampilkan tombol Lanjut
        });
      } else {
        button.classList.remove('bg-gray-200', 'hover:bg-gray-300');
        button.classList.add('bg-red-500');
        Swal.fire({
          title: 'Salah!',
          text: 'Jawabannya Salah!',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  });
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const droppedObject = document.getElementById(data);

  const targetButton = event.target;

  // Periksa apakah objek yang dijatuhkan sudah ada di tombol target
  if (targetButton.querySelector(`#${data}-mini`)) {
    alert("Objek ini sudah di-drop di sini.");
    return; // Mencegah penempatan duplikat
  }

  // Buat miniObject untuk merepresentasikan objek yang dijatuhkan
  const miniObject = document.createElement("div");
  miniObject.className = `w-4 h-4 rounded-full bg-${droppedObject.classList.contains('bg-red-500') ? 'red' : 'green'}-500 text-white flex items-center justify-center`;
  miniObject.textContent = droppedObject.textContent;
  miniObject.id = `${data}-mini`; // ID unik untuk pelacakan

  // Penempatan acak di dalam tombol
  miniObject.style.position = 'absolute';
  miniObject.style.top = `${Math.random() * 50 + 25}%`;
  miniObject.style.left = `${Math.random() * 50 + 25}%`;

  targetButton.appendChild(miniObject);
  
  // Tingkatkan penghitung objek yang dijatuhkan
  droppedCount++;
}

function resetGrid() {
  Swal.fire({
    title: 'Konfirmasi',
    text: "Apakah Anda yakin ingin mereset grid? Semua objek yang di-drop akan dihapus.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Tidak'
  }).then((result) => {
    if (result.isConfirmed) {
      const gridButtons = document.querySelectorAll('#button-grid button');
      droppedCount = 0;
      gridButtons.forEach(button => {
        const droppedObjects = button.querySelectorAll('.rounded-full');
        droppedObjects.forEach(object => {
          button.removeChild(object);
        });
        button.classList.remove('bg-green-500', 'bg-red-500');
        button.classList.add('bg-gray-200', 'hover:bg-gray-300');
      });

      Swal.fire({
        title: 'Reset!',
        text: 'Grid telah direset.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
  });
}

function nextstep() {
  Swal.fire({
    title: 'Lanjut ke Perhitungan Selanjutnya',
      text: '',
      icon: 'info',
      confirmButtonText: 'OK'
  }).then((result) => {
    if (result.isConfirmed) {
      const gridButtons = document.querySelectorAll('#button-grid button');
      droppedCount = 0;
      gridButtons.forEach(button => {
        const droppedObjects = button.querySelectorAll('.rounded-full');
        droppedObjects.forEach(object => {
          button.removeChild(object);
        });
        button.classList.remove('bg-green-500', 'bg-red-500');
        button.classList.add('bg-gray-200', 'hover:bg-gray-300');
      });
    }
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
  document.getElementById('draggableObjects').classList.add('hidden');

  nextstep();
}

function checkBothCalculations() {
  if (isKPKCorrect && isFPBCorrect) {
    const nextButton = document.getElementById('next-btn');
    nextButton.textContent = 'Lanjut';
    nextButton.onclick = () => location.reload(); // Fungsi untuk me-refresh halaman
    nextButton.classList.remove('hidden');
  }
}
