import React from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useLocation } from "react-router-dom";
import { Link, Routes, Route, useParams } from "react-router-dom";

// const style = {

//     bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
//     p: 4,
//   };
// function makeid(length) {
//   var result = '';
//   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   var charactersLength = characters.length;
//   for (var i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() *
//       charactersLength));
//   }
//   return result;
// }

// export default function Basket() {
//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//   const location = useLocation();
//   const pathArray = location.pathname.substring(1).split("/");
//   pathArray.shift();
//   console.log(Math.random() )
//   console.log("locasyon: ", pathArray);
//   return (
//     <div>
//       <Link key={Math.random()} to={`${location.pathname}/${makeid(10)}`}>
//         Beni yolla
//       </Link>

//       <Routes>
//         <Route path={`${location.pathname}/:catId`} element={Basket} />
//       </Routes>




//       <label>test</label>
//       <input></input>
//       <Button onClick={handleOpen}>Open modal</Button>
//       <Modal
//         aria-labelledby="transition-modal-title"
//         aria-describedby="transition-modal-description"
//         open={open}
//         onClose={handleClose}
//         closeAfterTransition
//         BackdropComponent={Backdrop}
//         BackdropProps={{
//           timeout: 500,
//         }}
//       >
//         <Fade in={open}>
//           <Box className='p-8 w-100 absolute -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 bg-gray-200 border-2 border-black'>
//             <Typography id="transition-modal-title" variant="h6" component="h2">
//               Text in a modal
//             </Typography>
//             <Typography id="transition-modal-description" sx={{ mt: 2 }}>
//               Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
//             </Typography>
//           </Box>
//         </Fade>
//       </Modal>
//     </div>
//   );
// }
const categories = [
  { id: 0, title: "Kingdom: Animal", subcategories: [1, 2, 3, 4] },
  { id: 1, title: "Phylum: Chordata", subcategories: [2] },
  { id: 2, title: "Clade: Synapsida", subcategories: [3] },
  { id: 3, title: "Class: Mammailia", subcategories: [4] },
  { id: 4, title: "Order: Carnivora", subcategories: [5] },
  { id: 5, title: "Subfamily: Felinae", subcategories: [6] },
  { id: 6, title: "Genus: Felis", subcategories: [7] },
  { id: 7, title: "Species: Felis catus", subcategories: [] }
];

const Basket = () => {
  const location = useLocation();
  const params = useParams();
  const category = categories.find(category => {
    return parseInt(params.catId) === category.id;
  });
  
  return (
    <>
    
      {location && (
        <>
          <h1>{category.title}</h1>
          {category.subcategories.map(subCategoryId => {
            console.log(subCategoryId)
            return (
              <div>
                <Link key={subCategoryId} to={`${location.pathname}/${subCategoryId}`}>
                  {categories.find(cat => cat.id === subCategoryId).title}
                </Link>
              </div>
            );
          })}
          {category.id === 7 && (
            <img src="https://cataas.com/cat" alt="cat" height="300" />
          )}
          <label>test</label>
          <input></input>
        </>
      )}
      <Routes>
        <Route path={`${location.pathname}/:catId`} component={Basket} />
      </Routes>
    </>
  );
};
export default Basket;