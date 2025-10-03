import React from 'react'
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'

interface CardInfosProps {
  title: string
  content: React.ReactNode
  action?: React.ReactNode
}

export const CardInfos = ({ title, content, action }: CardInfosProps) => {
  return (
    <Card>
  <CardHeader>
    <CardTitle>{title}</CardTitle>
  </CardHeader>
  <CardContent>
    {content}
  </CardContent>
  <CardFooter>
    <CardAction>
      {action}
    </CardAction>
  </CardFooter>
</Card>
  )
}
