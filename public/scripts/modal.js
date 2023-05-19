function hideModal() {
  document.getElementById("modal-wrapper").style.display = "none";
}

window.onclick = function (event) {
  if (event.target == document.getElementById("modal-wrapper")) {
    document.getElementById("modal-wrapper").style.display = "none";
  }
};
