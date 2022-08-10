const groupday = (value, index, array) => {
   let byday={};
    let d = new Date(value['dt'] * 1000);
    d = Math.floor(d.getTime()/(1000*60*60*24));
    byday[d]=byday[d]||[];
    byday[d].push(value);
  return byday
};

const roundToTwo = (num) => {
  return +(Math.round(num + "e+0") + "e-0");
};
const getCardinalDirection = (angle) =>{
  const directions = ['↑ N', '↗ NE', '→ E', '↘ SE', '↓ S', '↙ SW', '← W', '↖ NW'];
  return directions[Math.round(angle / 45) % 8];
};
const toFehrenhiet = (temp)=>{
  return ((temp * 9) / 5 + 32);

}
export {getCardinalDirection,roundToTwo,groupday,toFehrenhiet};
