import { useEffect, useRef } from "react";


// I found that this library is not good at all and I should write a simple library that works better

export default function WordCloud(props) {
  const ref = useRef(null);
  const words = props.words;

 /*const words = [
    { word_id: 1, word: "React", count: 100 },
    { word_id: 2, word: "JavaScript", count: 80 },
    { word_id: 3, word: "CSS", count: 40 },
    { word_id: 4, word: "HTML", count: 70 },
  ];*/
  const maxCount = Math.max(...words.map(w => w.count));

  return <div className="w-full h-40" ref={ref}>{words.map((w, i)=>{

        const weight = w.count / maxCount;
        const fontSize = 5 + weight * 20;
        //const radius = (1 - weight) * 150;
        const angle = i * (Math.PI * 2 / words.length);
        const hue = (i * 137.508) % 360; // golden angle
        const textColor = `hsl(${hue}, 70%, 60%)`;

        //const x = Math.cos(angle) * radius;
        //const y = Math.sin(angle) * radius;
        const rand_sign_x = Math.floor(Math.random()*10) <= 5 ? -1 : 1;
        const rand_sign_y = Math.floor(Math.random()*10) <= 5 ? -1 : 1;
        const x = (rand_sign_x)*(1 - weight)*400;
        const y = (rand_sign_y)*(1 - weight)*30;
        

    return (<div key={w.word_id} className={`absolute hover:font-bold
     top-1/2 left-1/2`} style={{
            color: `${textColor}`,
            transform: `translate(${x}px, ${y}px)`,
            fontSize: `${fontSize}px`,
          }}>{w.word}</div>);
  })}</div>;
}