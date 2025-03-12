import './globals.css'

export const metadata = {
  title: 'AI Mock Interview Assistant',
  description: 'Practice interviews with AI assistance',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
