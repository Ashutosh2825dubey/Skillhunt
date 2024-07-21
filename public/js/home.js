let title=document.querySelector('.main_heading');
let name="SkillHunt";
let index=1;

const typeWriter=()=>{
    let new_title=name.slice(0,index);
    title.innerText=new_title;
    index > name.length ? index=1:index++;

    setTimeout(()=> typeWriter(),150)



}
typeWriter();

function showSidebar(){
    const sidebar=document.querySelector('.sidebar')
    sidebar.style.display='flex'

};

function hideSidebar(){
    const sidebar=document.querySelector('.sidebar')
    sidebar.style.display='none'
    
};
function navigateToPage() {
   
    window.location.href = '/skill_hunt/skill_wind';
  }
