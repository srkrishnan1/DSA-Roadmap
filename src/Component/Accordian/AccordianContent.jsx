import { useEffect, useRef, useState } from "react";
import List from "./list";

const AccordianContent = ({
  isActive,
  data,
  groupView,
  changeStatus,
  
}) => {
  const listRef = useRef(null);
  const [height, setMaxHeight] = useState("0px");
  useEffect(() => {
    if (isActive || groupView) {
      setMaxHeight(`${listRef.current.scrollHeight}px`);
    } else {
      setMaxHeight(`0px`);
    }
  }, [isActive, data, groupView]);


  return (
    <div
      ref={listRef}
      className={`accordianListDiv ${
        isActive || groupView ? "active" : "inActive"
      }`}
      style={{ maxHeight: height }}
    >
      <List data={data} changeStatus={changeStatus}  />
    </div>
  );
};

export default AccordianContent;
