# task-manager
Simple, fun task manager that uses localStorage.

Task manager needs to be run on a live server to save data to localStorage and export files as a CSV.


## Build Instrutions for Window

### Pre-reqs
1. Install Python 3.7 x64
    - Install to C:\Python37
    - Add environment 'PATH' variables:
        C:\Python37\
        C:\Python37\Scripts
2. Install Mingw-64 GCC compiler (Windows only):
    - Install to C:\mingw-w64
    - Select Architecture: `x86_64`
    - Select Threads: `posix`
    - Add environment 'PATH' variable:
        `C:\mingw-w64\mingw-w64\bin\`
    - Add new environment 'CC' variable:
        `C:\mingw-w64\mingw-w64\bin\gcc.exe`
3. Install Python Package: Nuitka
    - From a command prompt:
        `python -m pip install Nuitka`

### Verify Pre-Reqs Installed
1. From a new command prompt window enter:
   `python --version`
   `python -m nuitka --version`
   `gcc.exe --version`

### Build the Executable
1. From a command prompt window, navigate to the '..\task-manager\src' directory:
    `cd C:\Projects\git\task-manager\src`
2. Run the following Nuitka compile command:
    `python -m nuitka --standalone --windows-icon="C:\Projects\git\task-manager\task-manager\src\static\favicon.ico" --remove-output main.py`
3. Move the '.\src\main.dist' folder to the parent folder '.\main-dist'
3. Copy the '.\src\static' folder to '.\main.dist\static'

### Run
1. Double-click 'main.dist\main.exe'
    Note: A Command Prompt should open and display: 
        `started server at: 'localhost:8000'`
2. Navigate to "http://localhost:8000" in a web browser    
