const ratio = 1.35
const chessRGB = [74, 62, 98]
const screen = '/images/screen.png'

function imgload(){
	let cv = document.getElementById('cv')
	cv.width = img.width
	cv.height = img.height

	let ctx = cv.getContext('2d')
	ctx.drawImage(img, 0, 0)
    ctx.fillStyle='#f00'
	let data = ctx.getImageData(0,0,cv.width,cv.height).data
	window.ctx = ctx
	window.data = data

	let t1 = new Date().getTime()
	getDistance(data)
	console.log('distance:', dis)
	let t2 = new Date().getTime()
	console.log('cost:', (t2 - t1))

}

function auto(){
	btn3.value = btn3.value == 'Manual' ? 'Auto' : 'Manual'
	window.autoFlag = btn3.value == 'Manual' ? true : false
}

function jump(){
    let time = window.dis*ratio
    console.log('press time..', time)
    get('/jump?t='+time, (data)=>{
        console.log('jump..', data)
			setTimeout(()=>{
				screencap()
			}, 1000)
    })
}

function screencap(){
    get('/screencap', (data)=>{
        console.log('fetch..', data)
        let img = document.getElementById('img')
        img.src = screen + '?t=' + new Date().getTime()
    })
}

function get(path, cb){
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = _=>{
        if(xhr.readyState==4 && xhr.status==200){
            cb(xhr.responseText)
        }
    }
    xhr.open('GET', path)
    xhr.send()
}

function calc(c, c2){
	return Math.sqrt(
			Math.pow(c[0]-c2[0], 2) +
			Math.pow(c[1]-c2[1], 2) +
			Math.pow(c[2]-c2[2], 2) 
			)
}

function getRGB(data, x, y){
	let i = x+y*cv.width
	i *= 4 // rgba
	return [data[i],data[i+1],data[i+2]]
}

function paint(p){
	ctx.fillRect(p.x, p.y, 10, 10)
}

function isChess(p){
	let c = getRGB(data, p.x, p.y+10)
	let d = calc(c, chessRGB)
	return d<20
}

function getTopPoint(a){
	a.sort((a,b)=>{
		return a.y - b.y
	})
	return a[0]
}

function groupByY(a){
	let a1 = []
	let a2 = []
	for(let i=0; i<a.length-1; i++){
		a2.push(a[i])
		let n = a[i].y - a[i+1].y 
		if(Math.abs(n) > 3){
			a1.push(a2)
			a2 = []
		}
	}
	a1.push(a2)
	return a1
}

function getDistance(data){
	let arr = []
	let bg = getRGB(data, 0, cv.height/3)
	// scan the pixels up down and find the edge
	for(let x=100; x<cv.width-100; x++){
		for(let y=cv.height/3; y<cv.height*3/4; y++){
			let c = getRGB(data, x, y)
			let d = calc(c, bg)
			if(d>22){
				ctx.fillRect(x, y, 3, 3)
				arr.push({x:x, y:y})
				break
			}

		}
	}

	// find the edge of different object
	let arr2 = groupByY(arr)
	let arr3 = []
	// get each top point
	for(let i in arr2){
		let t = getTopPoint(arr2[i])
		//console.log(t)
		arr3.push(t)
	}
	arr3.sort((a, b)=>{
		return a.y - b.y
	})

	let chessIdx = 0
	for(let i in arr3){
		if(isChess(arr3[i])){
			chessIdx = i
			break
		}
	}

	let boxTop = chessIdx == 0 ? arr3[1] : arr3[0]
	paint(boxTop)

	let boxBottom
	let boxTopColor = getRGB(data, boxTop.x, boxTop.y+30)
	//console.log('boxTopColor', boxTopColor)
	for(let i=255; i>0; i--){
		let c = getRGB(data, boxTop.x, boxTop.y+i)
		let d = calc(c, boxTopColor)
		if(d<15){
			boxBottom = {x:boxTop.x, y:boxTop.y+i}
			break
		}
	}
	//console.log('boxBottom:', boxBottom)
	if(!boxBottom){
		console.log('box bottom not found!!')
		boxBottom = {x:boxTop.x, y:boxTop.y+200}
	}
	paint(boxBottom)
	//console.log('boxBottom color', getRGB(data, boxBottom.x, boxBottom.y))

	let chessBottom = {x:arr3[chessIdx].x, y:arr3[chessIdx].y+205}
	console.log('chessBottom:', chessBottom)
	paint(chessBottom)

	let boxCenter = {x:boxTop.x, y:(boxTop.y + boxBottom.y)/2}
	console.log('boxCenter:', boxCenter)
	window.dis = Math.sqrt(Math.pow(chessBottom.x-boxCenter.x, 2) + Math.pow(chessBottom.y-boxCenter.y, 2))
	if(window.autoFlag) jump()
}

