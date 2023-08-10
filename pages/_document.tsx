import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <link rel="icon" type="image/jpg" sizes="16x16" href="/mld_logo.png"/>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=''/>
      <link href="https://fonts.googleapis.com/css2?family=Inter&family=Niramit&family=Zilla+Slab:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      </Head>
     
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
