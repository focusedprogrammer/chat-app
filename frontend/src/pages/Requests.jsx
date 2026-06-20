import { useEffect,useState }
from "react";

import API
from "../services/api";

function Requests(){

const [requests,setRequests]
=
useState([]);

useEffect(()=>{
fetchRequests();
},[]);

const fetchRequests=
async()=>{

const res=
await API.get(
"/follow/requests"
);

setRequests(res.data);
};

const acceptRequest=
async(id)=>{

await API.post(
"/follow/accept",
{
requestId:id
}
);

fetchRequests();
};

return(

<div>

<h2>
Follow Requests
</h2>

{
requests.map((r)=>(
<div key={r.id}>

<h4>
{r.name}
</h4>

<p>
@{r.username}
</p>

<button
onClick={()=>
acceptRequest(r.id)
}
>
Accept
</button>

</div>
))
}

</div>
)
}

export default Requests;