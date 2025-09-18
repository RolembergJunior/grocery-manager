import React, { ReactElement } from "react";

interface Props {
  isTrue?: boolean;
  elseElement?: ReactElement | ReactElement[];
  children: ReactElement | ReactElement[];
}

export default function RenderWhen(props: Props) {
  const { isTrue, children, elseElement } = props;

  if (!isTrue) {
    return <>{elseElement}</> || null;
  }

  return <>{children}</>;
}
