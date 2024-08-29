import createImageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "@/lib/sanity/config";

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export const urlForBenefitImage = source => {
  if (!source || !source.asset) return null;
  return imageBuilder.image(source).auto("format").url();
};
