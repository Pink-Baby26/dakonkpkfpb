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

  // Perhitungan KPK
  const kpkValue = lcm(number1, number2);
  populateGrid(kpkValue);

  // Atur status untuk KPK
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

  // Perhitungan FPB
  const fpbValue = gcd(number1, number2);
  populateGrid(fpbValue);

  // Atur status untuk FPB
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



// Fungsi untuk membuat objek draggable dari input number
function generateDraggableObjects(number1, number2) {
  const draggableContainer = document.getElementById('draggableObjects');
   // Kosongkan objek sebelumnya
  draggableContainer.classList.remove('hidden'); // Tampilkan container

  // Membuat objek draggable dari input 1
  const object1 = document.createElement('div');
  object1.id = 'draggable1';
  object1.draggable = true;
  object1.ondragstart = drag;
  object1.className = 'text w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white';
  object1.textContent = `${number1}`; // Menggunakan teks input1
  draggableContainer.appendChild(object1);

  // Membuat objek draggable dari input 2
  const object2 = document.createElement('div');
  object2.id = 'draggable2';
  object2.draggable = true;
  object2.ondragstart = drag;
  object2.className = 'text w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white';
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

  // Ambil elemen draggable yang sudah ada di grid ini
  const existingObjects = targetButton.querySelectorAll('.rounded-full');

  // Jika grid sudah berisi 2 objek draggable, tampilkan peringatan
  if (existingObjects.length >= 2) {
    Swal.fire({
      title: 'Penuh!',
      text: 'Grid ini sudah berisi 2 objek draggable.',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
    return;
  }

  // Ambil nilai asli grid dari atribut data
  const gridValue = parseInt(targetButton.getAttribute('data-grid-value'));

  // Ambil nilai dari objek draggable
  const draggableValue = parseInt(droppedObject.textContent);

  // Validasi objek draggable terhadap nilai grid
  if (isKPKCorrect) {
    if (gridValue % draggableValue !== 0) {
      Swal.fire({
        title: 'Tidak Valid!',
        text: `Angka ${gridValue} bukan kelipatan dari ${draggableValue}!`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
  } else if (isFPBCorrect) {
    if (draggableValue % gridValue !== 0) {
      Swal.fire({
        title: 'Tidak Valid!',
        text: `Angka ${draggableValue} bukan faktor dari ${gridValue}!`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
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

  Swal.fire({
    title: 'Berhasil!',
    text: 'Objek berhasil di-drop.',
    icon: 'success',
    confirmButtonText: 'OK'
  });
}




// Tambahkan variabel untuk menyimpan hasil KPK dan FPB
let currentAnswer = null;

// Fungsi untuk memvalidasi jawaban dan mengubah warna tombol
// Validasi jawaban pada grid
function validateAnswer(button) {
  // Ambil nilai grid
  const gridValue = parseInt(button.getAttribute('data-grid-value'));

  // Ambil semua elemen kecil dari grid ini
  const miniObjects = button.querySelectorAll('.rounded-full');

  // Pastikan ada 2 elemen yang dijatuhkan
  if (miniObjects.length < 2) {
    Swal.fire({
      title: 'Belum Lengkap!',
      text: 'Pastikan 2 objek draggable sudah dijatuhkan di grid ini.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return;
  }

  // Ambil nilai dari objek draggable
  const draggableValues = Array.from(miniObjects).map(obj => parseInt(obj.textContent));

  let isValid = false; // Untuk validasi jawaban
  let correctAnswer = null; // Jawaban benar

  if (isKPKCorrect) {
    // Hitung KPK dari angka draggable
    correctAnswer = draggableValues.reduce((acc, value) => lcm(acc, value), 1);
    
    // Periksa apakah nilai grid adalah KPK
    isValid = gridValue === correctAnswer;

  } else if (isFPBCorrect) {
    // Hitung FPB dari angka draggable
    correctAnswer = draggableValues.reduce((acc, value) => gcd(acc, value), draggableValues[0]);

    // Periksa apakah nilai grid adalah FPB
    isValid = gridValue === correctAnswer;
  }

  // Konfirmasi Jawaban
  Swal.fire({
    title: 'Konfirmasi',
    text: "Apakah Anda yakin dengan jawaban ini?",
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Tidak'
  }).then((result) => {
    if (result.isConfirmed) {
      if (isValid) {
        button.classList.add('bg-green-500');
        Swal.fire('Benar!', 'Jawaban Anda benar!', 'success');
        document.getElementById('next-btn').classList.remove('hidden');
      } else {
        button.classList.add('bg-red-500');
        Swal.fire('Salah!', `Jawaban yang benar adalah ${correctAnswer}.`, 'error');
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





function drop(event) {
  event.preventDefault();

  const data = event.dataTransfer.getData("text");
  const droppedObject = document.getElementById(data);

  const targetButton = event.target;

  // Ambil nilai asli grid dari atribut data
  const gridValue = parseInt(targetButton.getAttribute('data-grid-value'));

  // Ambil nilai dari objek draggable
  const draggableValue = parseInt(droppedObject.textContent);

  // Validasi objek draggable terhadap nilai grid
  if (isKPKCorrect) {
    if (gridValue % draggableValue !== 0) {
      Swal.fire({
        title: 'Tidak Valid!',
        text: `Angka ${gridValue} bukan kelipatan dari ${draggableValue}!`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
  } else if (isFPBCorrect) {
    if (draggableValue % gridValue !== 0) {
      Swal.fire({
        title: 'Tidak Valid!',
        text: `Angka ${draggableValue} bukan faktor dari ${gridValue}!`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
  }

  // Periksa apakah objek yang sama sudah ada di tombol ini
  if (targetButton.querySelector(`#${data}-mini`)) {
    Swal.fire({
      title: 'Gagal!',
      text: 'Objek ini sudah di-drop di tombol ini.',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
    return;
  }

  // Tambahkan elemen visual untuk objek draggable
  const miniObject = document.createElement('div');
  miniObject.className = `w-4 h-4 rounded-full bg-${droppedObject.classList.contains('bg-red-500') ? 'red' : 'green'}-500 text-white flex items-center justify-center`;
  miniObject.textContent = draggableValue;
  miniObject.id = `${data}-mini`; // ID unik untuk pelacakan

  // Posisi acak di dalam tombol
  miniObject.style.position = 'absolute';
  miniObject.style.top = `${Math.random() * 50 + 25}%`;
  miniObject.style.left = `${Math.random() * 50 + 25}%`;

  targetButton.appendChild(miniObject);

  Swal.fire({
    title: 'Berhasil!',
    text: 'Objek berhasil di-drop.',
    icon: 'success',
    confirmButtonText: 'OK'
  });
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
  // Jika kedua tombol KPK dan FPB sudah ditekan
  if (isKPKCorrect && isFPBCorrect) {
      const nextButton = document.getElementById('next-btn');
      nextButton.textContent = 'Refresh'; // Ubah teks tombol menjadi Refresh
      nextButton.onclick = () => location.reload(); // Tambahkan fungsi refresh halaman
      nextButton.classList.remove('hidden'); // Tampilkan tombol
  }
}




