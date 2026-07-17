<script setup lang="ts">
import { FileCard, Grid, Link } from '@/components/custom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { PhInfo } from '@phosphor-icons/vue'
import { useStorage } from '@vueuse/core'
import { saveAs } from 'file-saver'
import { transformMakTransactionHistoryToPortfolioPerformance } from './core/mak-to-pp'

const havasdMode = useStorage('havasdMode', true)

const processMakFiles = async (files: File[]) => {
  if (!files[0]) {
    return
  }

  const csv = await transformMakTransactionHistoryToPortfolioPerformance(files[0], havasdMode.value)

  saveAs(csv, 'transaction.csv')
}
</script>

<template>
  <div class="container mx-auto mt-6">
    <section class="mb-3">
      <h2 class="mb-3">ÁNYK</h2>

      <Grid>
        <Card>
          <CardHeader>
            <CardTitle>ÁNYK Docker image-ek</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="https://github.com/Res42/anyk-docker" variant="button" open-in-new-tab>
              https://github.com/Res42/anyk-docker
            </Link>
          </CardContent>
        </Card>
      </Grid>
    </section>

    <section class="mb-3">
      <h2 class="mb-3">Portfolio Performance</h2>

      <Grid>
        <FileCard
          id="makToPp"
          :accept="['application/vnd.ms-excel']"
          @files-changed="processMakFiles"
        >
          <CardHeader>
            <CardTitle>MÁK <code>transaction.xls</code> átalakító</CardTitle>
          </CardHeader>

          <CardContent>
            <div class="flex items-center justify-center gap-3">
              <Checkbox id="havasdMode" v-model:model-value="havasdMode" />
              <Label for="havasdMode">
                Havasd mód

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <PhInfo :size="24" weight="fill" class="text-primary" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>
                        Ha használod a
                        <Link href="https://github.com/havasd/pp-scraper" open-in-new-tab>
                          https://github.com/havasd/pp-scraper
                        </Link>
                        adatait, akkor pipáld be.
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
            </div>
          </CardContent>
        </FileCard>

        <Card>
          <CardHeader>
            <CardTitle>Magyar ingatlan árak</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="https://github.com/Res42/pp-hu-re-scraper" variant="button" open-in-new-tab>
              https://github.com/Res42/pp-hu-re-scraper
            </Link>
          </CardContent>
        </Card>
      </Grid>
    </section>
  </div>
</template>

<style scoped></style>
