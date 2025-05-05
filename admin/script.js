let albumEntries = [];

document.getElementById("add-album-btn").addEventListener("click", function () {
  const name = document.getElementById("album-name").value.trim();
  const link = document.getElementById("album-link").value.trim();
  const image = document.getElementById("album-image").value.trim();

  if (!name || !link || !image) {
    alert("Please fill in all album fields.");
    return;
  }

  const entry = { name, link, image };
  albumEntries.push(entry);

  const li = document.createElement("li");
  li.textContent = `${name}`;
  document.getElementById("album-list").appendChild(li);

  document.getElementById("album-name").value = "";
  document.getElementById("album-link").value = "";
  document.getElementById("album-image").value = "";
});

function generateArtistPage(artistName, albums) {
  const title = `${artistName} - YZYSTREAM`;
  const artistSlug = artistName.toLowerCase().replace(/\s+/g, "-");
  const albumDivs = albums.map(album => {
    return `
      <a href="${album.link}" class="block border-t border-zinc-300 py-4 px-6 hover:bg-zinc-50 transition">
        <div class="flex items-center gap-6">
          <img src="${album.image}" class="w-24 h-24 object-cover rounded" />
          <div class="text-xl">${album.name}</div>
        </div>
      </a>
    `;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>${title}</title>
    <link rel="icon" type="image/png" href="/favicon.png" />
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-white text-black">
    <main class="flex flex-col min-h-screen">
      <header class="px-6 py-4 border-b border-zinc-300 flex items-center justify-between">
        <a href="/" class="text-2xl font-bold tracking-tight">YZYSTREAM</a>
        <a href="/faq.html" class="text-sm text-zinc-500 hover:text-zinc-800">FAQ</a>
      </header>
      <div class="max-w-4xl w-full mx-auto flex-1 px-6 py-12">
        <h1 class="text-4xl font-bold mb-10">${artistName}</h1>
        <div class="grid gap-4">
          ${albumDivs}
        </div>
      </div>
      <footer class="px-6 py-4 border-t border-zinc-300 text-center text-sm text-zinc-500">
        &copy; ${new Date().getFullYear()} YZYSTREAM. All rights reserved.
      </footer>
    </main>
  </body>
</html>`;
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.getElementById("generate-page-btn").addEventListener("click", function () {
  const artistName = document.getElementById("page-artist-name").value.trim();

  if (!artistName) {
    alert("Please enter artist name");
    return;
  }

  if (albumEntries.length === 0) {
    alert("Please add at least one album");
    return;
  }

  const generatedHTML = generateArtistPage(artistName, albumEntries);

  document.getElementById("code-output").value = generatedHTML;
  document.getElementById("output-container").classList.remove("hidden");
  document.getElementById("output-container").scrollIntoView({ behavior: "smooth" });

  const safeFilename = artistName.toLowerCase().replace(/\s+/g, "-") + ".html";
  downloadFile(safeFilename, generatedHTML);
});

document.getElementById("download-html-btn").addEventListener("click", function () {
  const artistName = document.getElementById("page-artist-name").value.trim();
  const content = document.getElementById("code-output").value;
  const safeFilename = artistName.toLowerCase().replace(/\s+/g, "-") + ".html";
  downloadFile(safeFilename, content);
});
