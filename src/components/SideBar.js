// import React from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


// const SideBar = ({ items, onSelectItem }) => {
//     return (
//         <ul className="w-[15%] min-h-[50vh] bg-white list-none mr-2.5 hidden sm:block">
//             {items.map((item, index) => (
//                 <li 
//                 key={index} 
//                 onClick={() => onSelectItem(item)}
//                 className="h-12 text-black border-b border-black text-center p-2.5 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
//                 >
//                 <span className="mr-2.5">
//                     <FontAwesomeIcon icon={item.icon}/>
//                 </span>
//                 {item.label}
//                 </li>
//             ))}
//         </ul>
//     );
// };

// export default SideBar;


import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SideBar = ({ items, onSelectItem, activeItem }) => {
    return (
        <aside className="w-[15%] min-w-[200px] bg-white rounded-lg overflow-hidden hidden sm:block">
            <div className="bg-[#ffffff] text-[#1a3a52] px-4 py-4 border-b border-[#1D546C]">
                <h3 className="font-semibold text-lg">Menu</h3>
            </div>
            <ul className="list-none">
                {items.map((item, index) => (
                    <li 
                        key={index} 
                        onClick={() => onSelectItem(item)}
                        className={`
                            flex items-center gap-3 px-4 py-4 text-gray-700
                            border-b border-gray-100 last:border-b-0
                            cursor-pointer transition-all duration-300
                            hover:bg-[#1a3a52] hover:text-white hover:pl-6
                            ${activeItem === item.label ? 'bg-[#1a3a52] text-white' : ''}
                        `}
                    >
                        <span className="w-5 text-center">
                            <FontAwesomeIcon icon={item.icon} className="text-lg" />
                        </span>
                        <span className="font-medium text-sm">{item.label}</span>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default SideBar;

