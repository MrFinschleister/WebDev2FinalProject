function pageLoaded() {
    let date = new Date()
    document.getElementById('date').innerHTML = "Todays date: " + date.getMonth() + "/" + date.getDay() + "/" + date.getFullYear()
    document.addEventListener('keydown', keypressed)
}
function keypressed(e) {
    if (e.key == "Enter") {
        e.preventDefault()
    }
}