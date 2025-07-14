import tkinter as tk
from tkinter import messagebox

def main():
    root = tk.Tk()
    root.withdraw()  # Hide the main window
    messagebox.showinfo("CuraWound", "CuraWound is running successfully.")
    root.destroy()

if __name__ == "__main__":
    main()

