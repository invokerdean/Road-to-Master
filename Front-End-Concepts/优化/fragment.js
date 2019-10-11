var root=document.getElementById('root');
var fragment=document.createDocumentFragment();
for(let i=0;i<1000;i++){
  let li=document.createElement('li');
  li.innerHTML='我是标签li';
  fragment.appendChild(li);
}
root.appendChild(fragment);
