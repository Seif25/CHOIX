import Image from 'next/image'

export default function Home() {
  return (
    <main>
      <nav className='flex items-center justify-center p-5'>
        <Image src="/CHOIX_logo.png" alt="CHOIX" width={200} height={200}/>
      </nav>
    </main>
  )
}
