import ErrorState from '@/components/shared/ErrorState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import PageHeader from '@/components/shared/PageHeader'
import { FileImage } from '@/components/shared/FileImage'
import RichTextViewer from '@/components/shared/RichTextViewer'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, ArrowLeft, Building2, Globe, Image as ImageIcon, Mail, MapPin, Phone, PieChart, Settings } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useDivision } from './useDivisions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DoctorManagement } from './DoctorManagement'

export default function DivisionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: division, isLoading, isError, refetch } = useDivision(id!)

  if (isLoading) return <div className="p-8 flex justify-center"><LoadingSpinner /></div>
  if (isError || !division) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/divisions">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
             {division.logo && <FileImage path={division.logo} alt="" className="h-10 w-10 object-contain" />}
             <div>
               <PageHeader
                 heading={division.name}
                 text={`${division.shortName} • ${division.serviceCategory?.title} • ${division.divisionCategory?.name}`}
               />
               <div className="flex items-center gap-2 mt-1">
                 <StatusBadge type="active" isActive={division.isActive} />
               </div>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" asChild>
            <Link to={`/divisions/${division.id}/edit`} state={{ from: `/divisions/${division.id}` }}>
              <Settings className="mr-2 h-4 w-4" />
              Edit Division
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to={`/bookings?divisionId=${division.id}`}>View Bookings</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Medical Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Left Column - Info & Contact */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-xs text-muted-foreground uppercase">Location</p>
                      <p>{division.location || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-xs text-muted-foreground uppercase">Phone</p>
                      <p>{division.contact?.phone || 'Not available'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-xs text-muted-foreground uppercase">Email</p>
                      <p>{division.contact?.email || 'Not available'}</p>
                    </div>
                  </div>
                  {division.contact?.googleMap && (
                    <Button variant="outline" size="sm" asChild className="w-full mt-2">
                      <a href={division.contact.googleMap} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" />
                        Open in Maps
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <PieChart className="h-4 w-4" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {division.stats.map((stat) => (
                      <div key={stat.id} className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-lg font-bold">{stat.value}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                      </div>
                    ))}
                    {division.stats.length === 0 && (
                      <p className="col-span-2 text-center text-xs text-muted-foreground py-4 italic">No stats available.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle/Right Column - Content */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{division.overview}</p>
                  <RichTextViewer content={division.description ?? ''} className="mt-4 text-slate-600" />
                </CardContent>
              </Card>

               <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Core Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {division.coreServices.map((service) => (
                      <Badge key={service.id} variant="secondary">
                        {service.name}
                      </Badge>
                    ))}
                    {division.coreServices.length === 0 && (
                      <p className="text-sm text-muted-foreground italic">No core services listed.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Gallery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                     {division.images.map((img) => (
                       <div key={img.id} className="aspect-square rounded-xl overflow-hidden bg-muted border hover:border-primary/50 transition-colors group relative">
                          <FileImage path={img.path} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                       </div>
                     ))}
                     {division.images.length === 0 && (
                       <p className="col-span-full text-center text-sm text-muted-foreground py-12 border-2 border-dashed rounded-xl">No images uploaded.</p>
                     )}
                   </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team">
          {division.requiresMedicalTeam ? (
            <DoctorManagement divisionId={division.id} />
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              Medical team is not enabled for this division. Enable it in
              division settings to manage doctors.
            </div>
          )}
        </TabsContent>
      </Tabs>

    </div>
  )
}
