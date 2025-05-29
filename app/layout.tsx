import './globals.css'

export const metadata = {
  title: 'Jwonder Work Out',
  description: '건강한 운동 생활을 위한 종합 가이드',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link 
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard.css" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-pretendard">{children}</body>
    </html>
  )
} 