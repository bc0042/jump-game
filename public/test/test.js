window.onload = _=>{
    let ul = document.getElementById('ul')
    for(let i=0; i<10; i++){
        let a = document.createElement('a')
        a.href = '#'
        a.innerHTML = `<li>${i+1}.png</li>`
        a.onclick = _=>{
            img.src = '../images/'+a.innerText
        }
        ul.appendChild(a)
    }

	window.stopFlag = true
	let img = document.getElementById('img')
    img.onload = imgload
    img.src = '../images/screen.png'
}
