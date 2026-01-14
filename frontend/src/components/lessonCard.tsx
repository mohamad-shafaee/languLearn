 

 
export default function LessonCard(props) {
  
  //const [lessonItem, setLessonItem] = useState<LessonItem>({id: propos.item.id, author_id: propos.item.author_id, author_name: props.item.author_name, title: props.item.title,img_path: props.item.img_path, abstract: props.item.abstract});
  

const statusStyles = {
  published: "bg-green-50 border-2 border-green-200",
  raw: "bg-pink-50 border-2 border-pink-200",
};
 
  return (<div className={`flex px-2 w-full rounded-md ${statusStyles[props.item.status]}`}>
    {props.sortable && (<div className="flex w-16 h-fit border-2 border-gray-300 rounded-md my-4">
      <input type="text" value={props.item.order ?? ""}
      className="flex bg-[#fff] w-full h-fit text-xs font-bold px-2 py-2 rounded-md"
      placeholder="order" onChange={(e) => {props.onSorti(props.item, e.target.value)}}/></div>)}
    <img src={props.item.img_path || null} alt="Lesson Image"
          className="flex w-12 h-12 rounded-md ml-2 mt-4"/>
    <div className="flex flex-col py-2 px-4 w-[calc(70%-18px)] ">
      <div className="flex w-full font-bold pb-2 overflow-hidden border-b-1">{props.item.title}</div>
      <div className="flex text-xs h-[50%] overflow-hidden w-full ">{props.item.abstract}</div>
      <div className="flex text-xs italic w-full">{props.item.author_name}</div>
    </div>
    <div className="flex flex-col w-[30%] ">
      
      <div className="flex w-full ">
      <div className="flex w-fit text-xs px-4 py-1 my-1 mr-4 border-2 border-gray-300 rounded-md bg-gray-100 hover:cursor-pointer
       hover:bg-gray-50" onClick={() => props.onEditi(props.item)}>Edit</div>
       {(props.item.status == 'raw') && <div className="flex w-fit text-xs px-4 py-1 my-1 mr-4 border-2 border-gray-300 rounded-md bg-gray-100 hover:cursor-pointer
       hover:bg-gray-50" onClick={() => props.onPublishi(props.item)}>Publish</div>}
       {(props.item.status == 'published') && <div className="flex w-fit text-xs px-4 py-1 my-1 mr-4 border-2 border-gray-300 rounded-md bg-gray-100 hover:cursor-pointer
       hover:bg-gray-50" onClick={() => props.onUnPublishi(props.item)}>Un Publish</div>}
    </div> 
    <div className="flex w-full ">
      <div className="flex w-fit text-xs px-4 py-1 my-1 mr-4 border-2 border-gray-300 rounded-md bg-gray-100 hover:cursor-pointer
       hover:bg-gray-50" onClick={() => props.onRemovei(props.item)}>Remove</div>
       <div className="flex w-fit text-xs px-4 py-1 my-1 mr-4 border-2 border-gray-300 rounded-md bg-gray-100 hover:cursor-pointer
       hover:bg-gray-50" onClick={() => {}}>Preview</div>
    </div> 
    </div> 
    </div>);
}
 