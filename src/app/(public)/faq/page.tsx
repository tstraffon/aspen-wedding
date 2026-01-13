'use client'

import { useState } from 'react'
import { Card, CardBody } from '@/components/ui'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      category: 'General',
      questions: [
        {
          question: 'When is the wedding?',
          answer: 'The wedding ceremony will take place on Friday, September 19, 2026 at 4:00 PM.',
        },
        {
          question: 'Where is the wedding taking place?',
          answer: 'The ceremony will be held at the summit of Aspen Mountain (accessible by gondola), with the reception following at The Little Nell Grand Ballroom in Aspen, Colorado.',
        },
        {
          question: 'What is the dress code?',
          answer: 'The dress code is Formal/Black Tie Optional. We recommend bringing layers as mountain weather can be unpredictable, and it will be cooler at the summit.',
        },
        {
          question: 'When should I RSVP by?',
          answer: 'Please RSVP by August 19, 2026. You can submit your RSVP through this website.',
        },
      ],
    },
    {
      category: 'Travel & Accommodations',
      questions: [
        {
          question: 'What is the closest airport?',
          answer: 'Aspen/Pitkin County Airport (ASE) is just 6 miles from downtown. Alternatively, Denver International Airport (DEN) is about 200 miles away with shuttle services available.',
        },
        {
          question: 'Do you have a hotel room block?',
          answer: 'Yes! We have room blocks at several hotels. Please visit our Travel page for details and booking information.',
        },
        {
          question: 'Will there be transportation to and from the venues?',
          answer: 'Yes, we will provide shuttle service between major hotels and all event venues. Detailed shuttle schedules will be emailed one week before the wedding.',
        },
        {
          question: 'When should I book my hotel?',
          answer: 'Book as soon as possible! Aspen hotels fill up quickly, especially during peak season. We recommend booking by June 2026 at the latest.',
        },
      ],
    },
    {
      category: 'Ceremony & Reception',
      questions: [
        {
          question: 'Will the ceremony be indoors or outdoors?',
          answer: 'The ceremony will be outdoors at the summit of Aspen Mountain (elevation 11,212 feet). In case of severe weather, we have an indoor backup plan.',
        },
        {
          question: 'Is the wedding adults-only?',
          answer: 'We love your little ones, but we\'ve decided to make our wedding an adults-only celebration. We hope this gives parents a well-deserved night off!',
        },
        {
          question: 'Can I take photos during the ceremony?',
          answer: 'We kindly request an unplugged ceremony. Please keep phones and cameras away during the ceremony so everyone can be present in the moment. Feel free to take all the photos you want during the reception!',
        },
        {
          question: 'What time should I arrive for the ceremony?',
          answer: 'Guests will board the Silver Queen Gondola starting at 3:00 PM for a 4:00 PM ceremony start. Please arrive early to allow time for the gondola ride (approximately 15 minutes).',
        },
        {
          question: 'Will there be dinner at the reception?',
          answer: 'Yes! A full dinner will be served at the reception, along with cocktails, dancing, and DJ entertainment.',
        },
      ],
    },
    {
      category: 'Altitude & Weather',
      questions: [
        {
          question: 'What should I know about the altitude?',
          answer: 'Aspen sits at 8,000 feet elevation, and the ceremony location is at 11,212 feet. Give yourself time to acclimate, drink plenty of water, and take it easy on alcohol for the first day. If you have concerns, consult your doctor.',
        },
        {
          question: 'What will the weather be like in September?',
          answer: 'September in Aspen is beautiful but unpredictable. Daytime temperatures typically range from 50-70°F, but can drop to 30-40°F at night, especially at higher elevations. Pack layers and a warm jacket!',
        },
        {
          question: 'What should I wear to stay warm?',
          answer: 'We recommend bringing layers: a warm jacket or wrap for the ceremony (it\'s cooler at the summit), and comfortable shoes for walking. Ladies, consider bringing a pashmina or shawl.',
        },
      ],
    },
    {
      category: 'Food & Dietary Needs',
      questions: [
        {
          question: 'I have dietary restrictions. What should I do?',
          answer: 'Please indicate any dietary restrictions or allergies when you RSVP. We will work with our caterers to accommodate your needs.',
        },
        {
          question: 'Will there be vegetarian/vegan options?',
          answer: 'Yes! We will have vegetarian and vegan meal options available. Please specify your preference when you RSVP.',
        },
        {
          question: 'Is the bar open?',
          answer: 'Yes, we will have an open bar at the reception with beer, wine, and signature cocktails.',
        },
      ],
    },
    {
      category: 'Other Events',
      questions: [
        {
          question: 'Are there other events during the wedding weekend?',
          answer: 'Yes! We\'re hosting a Rehearsal Dinner on Thursday, September 18 (by invitation only) and a Farewell Brunch on Saturday, September 20 (all guests welcome). Check the Details page for more information.',
        },
        {
          question: 'What should I do if I\'m arriving early or staying late?',
          answer: 'Aspen has so much to offer! Check out our Travel page for recommendations on restaurants, activities, and things to do in the area.',
        },
      ],
    },
    {
      category: 'Gifts & Registry',
      questions: [
        {
          question: 'Where are you registered?',
          answer: 'We are registered at several stores. Please visit our Registry page for links and details.',
        },
        {
          question: 'Do you prefer gifts or cash?',
          answer: 'Your presence at our wedding is the greatest gift! If you wish to give a gift, we are registered at a few places, or contributions toward our honeymoon fund are greatly appreciated.',
        },
      ],
    },
  ]

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const index = categoryIndex * 100 + questionIndex
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-aspen-cream to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-aspen-sage to-aspen-forest py-20 px-4">
        <div className="container-custom text-center">
          <div className="flex justify-center mb-4">
            <HelpCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="heading-xl text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="body-text text-white/90 max-w-2xl mx-auto">
            Everything you need to know about our wedding weekend
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container-custom py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              {/* Category Header */}
              <div className="mb-6">
                <h2 className="heading-sm text-aspen-forest border-b-2 border-aspen-gold pb-2">
                  {category.category}
                </h2>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const index = categoryIndex * 100 + questionIndex
                  const isOpen = openIndex === index

                  return (
                    <Card
                      key={questionIndex}
                      className={cn(
                        'cursor-pointer transition-all duration-300',
                        isOpen ? 'shadow-xl' : 'hover:shadow-lg'
                      )}
                      onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                    >
                      <CardBody className="py-4">
                        {/* Question */}
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-semibold text-aspen-forest text-lg flex-1">
                            {faq.question}
                          </h3>
                          <div className="flex-shrink-0 pt-1">
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-aspen-copper" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-aspen-copper" />
                            )}
                          </div>
                        </div>

                        {/* Answer */}
                        <div
                          className={cn(
                            'overflow-hidden transition-all duration-300',
                            isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                          )}
                        >
                          <p className="body-text text-aspen-stone leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </CardBody>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Still Have Questions */}
      <div className="bg-aspen-gold/10 py-16 px-4">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-md text-aspen-forest mb-4">
              Still Have Questions?
            </h2>
            <p className="body-text text-aspen-stone mb-6">
              If you have questions that aren&apos;t answered here, please don&apos;t hesitate to reach out!
            </p>
            <div className="space-y-3">
              <p className="body-text text-aspen-forest">
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:emilyandtyler2026@gmail.com"
                  className="text-aspen-copper hover:underline"
                >
                  emilyandtyler2026@gmail.com
                </a>
              </p>
              <p className="body-sm text-aspen-stone">
                We&apos;ll get back to you as soon as possible!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mountain Footer */}
      <div className="py-12 text-center">
        <p className="text-6xl mb-4">🏔️</p>
        <p className="body-sm text-aspen-stone">
          See you in Aspen!
        </p>
      </div>
    </main>
  )
}
