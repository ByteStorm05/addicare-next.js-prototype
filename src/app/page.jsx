// app/page.js
import Image from 'next/image'
import Link from 'next/link'
import Navbar from './components/Mainnavnar'
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";


export default function Home() {
  return (<>
    <Navbar></Navbar>
    <div className="min-h-screen bg-gray-100 py-2" >
      
      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        

        <CardContainer className="inter-var">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
          <CardItem translateZ="50">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Track Progress.</span>
              <span className="block text-green-600">Build Resilience.</span>
              <span className="block">Stay Strong.</span>
            </h1>
          </CardItem>

          <CardItem translateZ="100">
          <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              Your personalized companion for managing addiction and tracking mood. Take control of your journey to recovery.
            </p>
          </CardItem>

           
            
            <div className="mt-8 sm:flex">
          <CardItem translateZ={120}> <div className="rounded-md shadow">
                <Link href="/authentication/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10">
                  Get Started
                </Link>
              </div></CardItem>
          <CardItem translateZ="60"><div className="mt-3 sm:mt-0 sm:ml-3">
                <Link href="https://www.linkedin.com/in/aarohi-bhanuj-chowdhary-43636420a/" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 md:py-4 md:text-lg md:px-10">
                  Learn More
                </Link>
              </div></CardItem>
             
              
            </div>
          </div>
          <CardItem translateZ="100">
          <div className="mt-12 lg:mt-0">
            <Image src="/images/hapihapi.jpg" alt="Recovery Illustration" width={500} height={500} className="rounded-lg shadow-xl" />
          </div>
          </CardItem>
         
        </div>
        </CardContainer>
        
        {/* <CardContainer className="inter-var">
  <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
    <CardItem
      translateZ="50"
      className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
    >
      <span className="block">Track Progress.</span>
      <span className="block text-green-600">Build Resilience.</span>
      <span className="block">Stay Strong.</span>
    </CardItem>
    <CardItem
      as="p"
      translateZ="60"
      className="text-gray-500 text-base mt-3 sm:mt-5 sm:text-lg sm:max-w-xl dark:text-neutral-300"
    >
      Your personalized companion for managing addiction and tracking mood. Take control of your journey to recovery.
    </CardItem>
    <CardItem translateZ="100" className="w-full mt-8 sm:flex">
      <div className="rounded-md shadow">
        <Link
          href="/authentication/signup"
          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
        >
          Get Started
        </Link>
      </div>
      <div className="mt-3 sm:mt-0 sm:ml-3">
        <Link
          href="https://www.linkedin.com/in/aarohi-bhanuj-chowdhary-43636420a/"
          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 md:py-4 md:text-lg md:px-10"
        >
          Learn More
        </Link>
      </div>
    </CardItem>
    <CardItem translateZ="100" className="mt-12 lg:mt-0">
      <Image
        src="/images/hapihapi.jpg"
        alt="Recovery Illustration"
        width={500}
        height={500}
        className="rounded-lg shadow-xl"
      />
    </CardItem>
  </CardBody>
</CardContainer> */}

       


        
      </main>
    </div></>
  )
}