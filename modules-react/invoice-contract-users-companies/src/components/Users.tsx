import { DataGrid } from "devextreme-react";
import React from "react";

export const Users: React.FC = () => {
  const [name, setName] = React.useState("");
  const [user, setUser] = React.useState<
    { name: string; age: number } | undefined
  >();
  return (
    <div>
      <div>{user && user.name}</div>
      <DataGrid></DataGrid>
    </div>
  );
};
