
today = new Date();
//오늘 날짜
year = today.getFullYear();
//올 해
month = today.getMonth();
//이번 달
YM = year + "년" + (month+1) + "월"; 
document.getElementById("YM").innerHTML = YM;
first_date = new Date(year,month,1).getDate();
last_date = new Date(year,month+1,0).getDate();
first_day = new Date(year,month,1).getDay();
function makecalendar(){
	calendar = document.getElementById("calendar");
	row = calendar.insertRow();
	for(i=0; i<first_day; i++){
		cell = row.insertCell();
		
	}
    for(i=1; i<=last_date; i++){
    if(first_day != 7){
        cell = row.insertCell();
        cell.setAttribute('id', [i]);
        cell.innerHTML = `<a href="/detail?year=${year}&month=${month+1}&day=${i}">${i}</a>`;
        first_day += 1;
    }
    else{
        row = calendar.insertRow();
        cell = row.insertCell();
        cell.setAttribute('id', [i]);
        cell.innerHTML = `<a href="/detail?year=${year}&month=${month+1}&day=${i}">${i}</a>`;
        first_day = first_day - 6;
        }
    }	
}
const before = document.querySelector("#before")
before.addEventListener('click',before_month);
function before_month() {
	while (calendar.rows.length > 2) {
	       calendar.deleteRow(calendar.rows.length-1);
		        }
	month = month-1
	if( month === -1){
		year = year - 1;
		month = month + 12;
	}
	Y = year + "년";
    M = (month+1) + "월"; 
	document.getElementById("YM").innerHTML = `${Y}${M}`;
	first_date = new Date(year,month,1).getDate();
	last_date = new Date(year,month+1,0).getDate();
	first_day = new Date(year,month,1).getDay();
	makecalendar();	
	}

const next = document.querySelector("#next");
next.addEventListener("click",next_month);
function next_month() {
	while (calendar.rows.length > 2) {
	       calendar.deleteRow(calendar.rows.length-1);
	        }
	month = month+1
	if(month === 12){
		year = year + 1;
		month = month -12;
	}
	
	Y = year + "년"
    M = (month+1) + "월"; 
	document.getElementById("YM").innerHTML = `${Y}${M}`;
	first_date = new Date(year,month,1).getDate();
	last_date = new Date(year,month+1,0).getDate();
	first_day = new Date(year,month,1).getDay();
	makecalendar();	
}

const toggle = document.querySelector("#toggle");
const list = document.querySelector("#menu");
toggle.addEventListener('click',()=>{
    if(list.style.display === "flex"){
        list.style.display = 'none';
    }else{
        list.style.display = 'flex';
    }
})

makecalendar();

