import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const Content = React.forwardRef((props, ref) => {

    return (
      <div ref={ref}>
        <div style={{ fontSize: "40px", color: "green" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Pretium
          auctor elit sed vulputate mi.
        </div>

      </div>
    );
})

export default function ComponentToPrint({ data }) {

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
});

  return (
    <div>
      <Content ref={componentRef} />
      <button onClick={handlePrint}>Print this out!</button>
    </div>
  );
};

