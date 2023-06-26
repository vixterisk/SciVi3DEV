# scivi.web

Web version of the SciVi scientific visualization system including SciVi thin client and the corresponding part of SciVi server, part of SciVi.Tools project

## Basics ##

SciVi system is based on the ontological engineering. Its behavior is fully governed by the knowledge base containing different ontologies. More about the SciVi concepts: https://scivi.tools/publications.html

The working process of SciVi has thin client has two main stages: data processing and visualization. Both stages are set up using data flow diagram (DFD), for which special node-based graphical editor is used. This editor allows to build graphs containing nodes with sockets, which cam be connected with links. Nodes represent operators (data obtaining, processing and visualization units) and links depict data transfer from one operator to another.

**Important note:** in fact, SciVi is an extensible environment. It is all about flexibility and reconfigurability. So its core is pretty tiny and does not include any visualization and data processing capabilities: they all are presented as *separated plugins*. According to the particular task, SciVi can be fully reconstructed by changing its knowledge base. The knowledge base stores all the things SciVi an do. And there is *no* "default" knowledge base (yet?): we create the corresponding one for each set of tasks we have to solve. And each "special" knowledge base contains only needed knowledge, no more that that, to ensure the lightweight and intuitive SciVi interface, avoiding user to be lost in tons of options and variants.

## Build and run ##

Python3 and npm are required.

Having them, first install all the stuff needed for the client:
```
cd client
npm install
cd -
```

And then just
```make```
and
```./run.py```

This will compile the js client core and run the python server.

## Knowledge base ##

The `kb` directory contains knowledge base that the server uses while working. Actually `kb` is a storage for onto repo. But server uses merged onto, so you need to perform the merge first. For this, run `merge.sh` inside `kb`.


## Unity Visualization ##

Unity visualization module runs separately and its source code and releases can be found [Here](https://github.com/vixterisk/SciViUnityVisualization) 
