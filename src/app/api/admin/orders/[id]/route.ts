import {requireSession,assertSameOrigin} from "@/lib/server/auth";
import {updateOrder,adminState} from "@/lib/server/workspace";
import {errorResponse,invariant} from "@/lib/server/errors";
export const runtime="nodejs";
export async function GET(request:Request,context:{params:Promise<{id:string}>}){try{const session=await requireSession(),{id}=await context.params,state=await adminState(session),order=state.orders.find(o=>o.id===id);invariant(order,"Order not found.",404);return Response.json({order,items:state.items.filter(i=>i.orderId===id),customer:state.customers.find(c=>c.id===order.customerId)});}catch(error){return errorResponse(error);}}
export async function PATCH(request:Request,context:{params:Promise<{id:string}>}){try{assertSameOrigin(request);const {user}=await requireSession(),{id}=await context.params;return Response.json(await updateOrder(id,await request.json(),user));}catch(error){return errorResponse(error);}}
