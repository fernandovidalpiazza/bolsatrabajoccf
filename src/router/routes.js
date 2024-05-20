//import Cart from "../components/pages/cart/Cart";
//import Checkout from "../components/pages/checkout/Checkout";
import CargaCv from "../components/pages/cargaCv/cargaCv";
import Home from "../components/pages/home/Home";
//import ItemDetail from "../components/pages/itemDetail/ItemDetail";
import ItemListContainer from "../components/pages/itemlist/ItemListContainer";
//import UserOrders from "../components/pages/userOrders/UserOrders";

export const routes = [
  {
    id: "home",
    path: "/",
    Element: Home,
  },
  {
    id: "cv",
    path: "/cv",
    Element: ItemListContainer,
  },
  {
    id: "cv",
    path: "/cvc",
    Element: CargaCv,
  },
]