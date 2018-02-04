window.onload = _=>{
    let ul = document.getElementById('ul')
	let img = document.getElementById('img')
	let btn1 = document.getElementById('btn1')
	let btn2 = document.getElementById('btn2')
	let btn3 = document.getElementById('btn3')

    img.onload = imgload
    btn1.onclick = screencap
    btn2.onclick = jump
    btn3.onclick = auto

    screencap()
}
