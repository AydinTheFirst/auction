import { Checkbox, CheckboxProps } from "@nextui-org/react";
import { useState } from "react";

export const CheckInput = (props: CheckboxProps) => {
  const [isSelected, setIsSelected] = useState(props.defaultSelected);

  return (
    <>
      <Checkbox
        isSelected={isSelected}
        onValueChange={setIsSelected}
        {...props}
      />
      <input name={props.name} type="hidden" value={String(isSelected)} />
    </>
  );
};
