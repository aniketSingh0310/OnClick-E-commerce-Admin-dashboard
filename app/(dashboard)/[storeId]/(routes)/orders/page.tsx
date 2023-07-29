import prismadb from "@/lib/prismadb";
import { OrderClient } from "./components/client";
import { Billboard } from "@prisma/client";
import { OrderColumn } from "./components/columns";
import { format } from "date-fns"
import { formatter } from "@/lib/utils";

const OrdersPage = async({
  params
}:{params:{storeId:string}
}) => {

  const orders= await prismadb.order.findMany({
    where:{
      storeId:params.storeId
    },
    include:{
      orderItems:{
        include:{
          product:true
        }
      }
    },
    orderBy:{ 
      createdAt:'desc'
    }
  })

  const formattedOrders:OrderColumn[]= orders.map((item)=>({
    id:item.id,
    phone:item.phone,
    address: item.address,
    products:item.orderItems.map((orderItem)=>orderItem.product.name).join(','),
    totalPrice: formatter.format(item.orderItems.reduce((total,item)=>{
      return total + Number(item.product.price)
    },0)),
    isPaid:item.isPaid,

    createdAt:format(item.createdAt,"MMMM do, yyyy")
  }));
  return (
    <>
      <div className="flex flex-col mx-3 mt-3">
        <OrderClient data={formattedOrders} />
      </div>
    </>
  );
};

export default OrdersPage;
