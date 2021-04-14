import React, { useState, useEffect } from "react";
import axios from "axios";

const MemberList = () => {
   const [MemeberLists, setMemberLists] = useState([]);

   useEffect(() => {
      const getMembers = async () => {
         try {
            const { data } = await axios.get(`https://localhost:5001/api/Student`);
            setMemberLists(data);
         } catch (error) {
            console.log(error);
         }
      };
      getMembers();
   }, []);
   console.log(MemeberLists);
   return MemeberLists.map((x) => {
      return (
         <option key={x.id} value={x.id}>
            {x.firstName + " " + x.lastName}
         </option>
      );
   });
};

export default MemberList;
