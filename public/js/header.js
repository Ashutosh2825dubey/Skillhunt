function showSidebar(){
    const sidebar=document.querySelector('.sidebar')
    sidebar.style.display='flex'

};

function hideSidebar(){
    const sidebar=document.querySelector('.sidebar')
    sidebar.style.display='none'
    
}
let title=document.querySelector('.sub-caption');
let name="Unlock Your Potential";
let index=1;

const typeWriter=()=>{
    let new_title=name.slice(0,index);
    title.innerText=new_title;
    index++;
    setTimeout(()=> typeWriter(),150)



}
typeWriter();