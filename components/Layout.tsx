import Nav from './Nav';
import Footer from './Footer';


type LayoutProps = {
    children: React.ReactNode
    footerColor?: string;
}

const Layout: React.FC<LayoutProps> = ({children, footerColor}) => {

  return (
        <div >
             <Nav />
            <div style={{flex: 1}}>
              {children}
            </div>
            
            <Footer footerColor={footerColor}/>
        </div>
  )
}

export default Layout;