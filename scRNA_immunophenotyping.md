# Immunophenotyping scRNA-seq data using Seurat 
RNA samples of CD40-treated & non-treated Triple-Negative Breast Cancer (TNBC) _mus musculus_ models were processed using 10x Genomics Cell Ranger Pipeline to produce scRNA-seq data

![cellranger](CellRanger_1sample-1flow.png)

## Seurat Preprocessing
Seurat is a R package used for scRNA-seq data processing, cell clustering, and immunophenotyping 
- **Input**: 10X Genomics directory
- **Output**: Seurat object that can be used for downstream analysis 

Seurat was used prior to immunophenotyping both CD40-treated and non-treated TNBC _mus musculus_ models

![seurat](seurat_workflow.png)

### Steps:
1. Create Seurat Object using 10X Genomics data
2. Quality Control: 
- Find percentage of reads that map to mitochondrial/ribosomal genome and remove them since dying cells typically have high mitochondrial activity
- Similarly we would also filter lowly expressed genes like we did for DESeq2
3. Normalization of data:
- Log transform the data into a log2 scale which is important for data with high variance, such as scRNA-seq data
4. Feature Selection:
- Identify genes highly expressed in some cells and lowly expressed in others
5. Scaling the data: 
Peforms a linear transformation that shifts mean expression of each gene across cells to 0 and variance to 1
This step is needed prior to performing PCA and removes background noise in the data so cells do not cluster based on noise
6. Linear Dimensionality Reduction (PCA): 
- To identify true dimensionality of data 
Visualize PCs using ElbowPlot() to see how many PCs we should use for clustering, 
For example, using the ElblowPlot on the right, we would only use around 9 or 10 PCs as that’s the graph plateaus 
7. Clustering: 
- Seurat uses Shared Nearest Neighbor (SNN) clustering algorithm to group the cells with similar gene expression distance cells with dissimilar gene expression
8 Non-linear Dimensionality Reduction (UMAP or tSNE): 
- Required to view clusters in low dimensional space 
9. FindAllMarkers(): 
- Identify DEGs (markers) using FindAllMarkers() which finds DEGs in a cluster compared to all other clusters
- Use biological markers that define each cluster to classify the clusters, 

## CD40-treated TNBC





