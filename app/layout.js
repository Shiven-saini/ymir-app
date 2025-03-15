import './globals.css'

export const metadata = {
  title: 'Yet Another Mock Interview Revision Assistant',
  description: 'Does it even matter?',
  icons: {
    icon: '/profile.png',
  },
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
