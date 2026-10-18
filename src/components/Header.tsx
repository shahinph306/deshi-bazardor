import Image from 'next/image';
import NavLinks from './NavLinks';
import CurrentDate from './Date';
import UserInfo from './UserInfo';


const Header = () => {

    // console.log(date);
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
            <div className='flex justify-between mx-auto container pt-4'>
                <div className='flex items-center gap-2 '>
                    <Image className='bg-green-600 p-2 rounded-xl' src={'/shopping-cart.png'} alt='Image' width='50' height='50'></Image>
                    <div>
                        <h1 className='text-xl font-bold'>বাজার দর</h1>
                       <CurrentDate></CurrentDate>
                    </div>
                </div>
               <UserInfo></UserInfo>
            </div>
            
                <NavLinks></NavLinks>

        </header>
    );
};

export default Header;