import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import LoadingSpinner from '@/components/shared/LoadingSpinner'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMyDivision, useUpdateMyDivision } from '@/features/my-division/useMyDivision'
import { showErrorToast } from '@/lib/error-utils'

type StatRow = { label: string; value: string }
type ContactRow = {
  phone: string
  email: string
  address: string
  googleMap: string
}

export default function ExtrasPage() {
  const { data: division, isLoading } = useMyDivision()
  const updateMutation = useUpdateMyDivision()

  const [stats, setStats] = useState<StatRow[]>([])
  const [coreServices, setCoreServices] = useState<string[]>([])
  const [contact, setContact] = useState<ContactRow>({
    phone: '',
    email: '',
    address: '',
    googleMap: '',
  })

  useEffect(() => {
    if (!division) return

    setStats(division.stats.map((item) => ({ label: item.label, value: item.value })))
    setCoreServices(division.coreServices.map((item) => item.name))
    setContact({
      phone: division.contact?.phone ?? '',
      email: division.contact?.email ?? '',
      address: division.contact?.address ?? '',
      googleMap: division.contact?.googleMap ?? '',
    })
  }, [division])

  if (isLoading) return <LoadingSpinner fullPage />

  const saveStats = () => {
    updateMutation.mutate(
      {
        stats: stats
          .filter((item) => item.label.trim() && item.value.trim())
          .map((item, index) => ({ ...item, sortOrder: index })),
      },
      {
        onSuccess: () => toast.success('Stats updated'),
        onError: (error) => showErrorToast(error, 'Failed to update stats'),
      },
    )
  }

  const saveCoreServices = () => {
    updateMutation.mutate(
      {
        coreServices: coreServices
          .filter((item) => item.trim())
          .map((name) => ({ name: name.trim() })),
      },
      {
        onSuccess: () => toast.success('Core services updated'),
        onError: (error) => showErrorToast(error, 'Failed to update core services'),
      },
    )
  }

  const saveContact = () => {
    updateMutation.mutate(
      {
        contact: {
          phone: contact.phone || undefined,
          email: contact.email || undefined,
          address: contact.address || undefined,
          googleMap: contact.googleMap || undefined,
        },
      },
      {
        onSuccess: () => toast.success('Contact information updated'),
        onError: (error) => showErrorToast(error, 'Failed to update contact information'),
      },
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Division Extras"
        text="Manage statistics, core services, and contact metadata."
      />

      <Tabs defaultValue="stats" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="core-services">Core Services</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <Card>
            <CardContent className="space-y-4 pt-6">
              {stats.map((item, index) => (
                <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                  <Input
                    value={item.label}
                    onChange={(event) =>
                      setStats((prev) =>
                        prev.map((row, rowIndex) =>
                          rowIndex === index
                            ? { ...row, label: event.target.value }
                            : row,
                        ),
                      )
                    }
                    placeholder="Label"
                  />
                  <Input
                    value={item.value}
                    onChange={(event) =>
                      setStats((prev) =>
                        prev.map((row, rowIndex) =>
                          rowIndex === index
                            ? { ...row, value: event.target.value }
                            : row,
                        ),
                      )
                    }
                    placeholder="Value"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setStats((prev) => prev.filter((_, rowIndex) => rowIndex !== index))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStats((prev) => [...prev, { label: '', value: '' }])}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Stat
                </Button>
                <Button onClick={saveStats} disabled={updateMutation.isPending}>
                  Save Stats
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="core-services">
          <Card>
            <CardContent className="space-y-4 pt-6">
              {coreServices.map((item, index) => (
                <div key={index} className="grid gap-3 md:grid-cols-[1fr_auto]">
                  <Input
                    value={item}
                    onChange={(event) =>
                      setCoreServices((prev) =>
                        prev.map((row, rowIndex) =>
                          rowIndex === index ? event.target.value : row,
                        ),
                      )
                    }
                    placeholder="Core service"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCoreServices((prev) => prev.filter((_, rowIndex) => rowIndex !== index))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCoreServices((prev) => [...prev, ''])}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
                <Button onClick={saveCoreServices} disabled={updateMutation.isPending}>
                  Save Core Services
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={contact.phone}
                    onChange={(event) =>
                      setContact((prev) => ({ ...prev, phone: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={contact.email}
                    onChange={(event) =>
                      setContact((prev) => ({ ...prev, email: event.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={contact.address}
                  onChange={(event) =>
                    setContact((prev) => ({ ...prev, address: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="googleMap">Google Map</Label>
                <Input
                  id="googleMap"
                  value={contact.googleMap}
                  onChange={(event) =>
                    setContact((prev) => ({ ...prev, googleMap: event.target.value }))
                  }
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={saveContact} disabled={updateMutation.isPending}>
                  Save Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
